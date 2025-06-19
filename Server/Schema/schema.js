
// mongoose models
const Project = require('../models/project');
const Client = require('../models/clients');



const { GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLEnumType } = require('graphql');
// Project Type

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        clientId: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            async resolve(parent, args) {
                return await Client.findById(parent.clientId); // Fetch client details based on clientId
            }
        }
    }),
});


// Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Client.findById(args.id);
            },
        },
        clients: {
            type: new GraphQLList(ClientType),
            async resolve(parent, args) {
                return await Client.find(); // Fetch all clients from the database
            }
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                return await Project.findById(args.id)
                    .populate('clientId', 'name email phone'); // Populate client details
            },
        },
        projects: {
            type: new GraphQLList(ProjectType),
            async resolve(parent, args) {
                return await Project.find();
            }
        },
    }),
});

// Mutation Type
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                phone: {
                    type: new GraphQLNonNull(GraphQLString)
                },
            },
            async resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return await client.save();
            }
        },
        deleteClient: {
            type: ClientType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(parent, args) {
                return await Client.findByIdAndDelete(args.id); // ✅ No .exec(), no reuse
            },
        },
        addProject: {
            type: ProjectType,
            args: {
                clientId: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'NOT_STARTED': { value: 'Not Started' },
                            'IN_PROGRESS': { value: 'In Progress' },
                            'COMPLETED': { value: 'Completed' },
                        },
                    }),
                    defaultValue: 'Not Started', // Default status
                }
            },
            async resolve(parent, args) {
                const project = new Project({
                    clientId: args.clientId,
                    name: args.name,
                    description: args.description,
                    status: args.status || 'Not Started', // Default status
                });
                return await project.save();
            }
        },
        deleteProject: {
            type: ProjectType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            async resolve(parent, args) {
                return await Project.findByIdAndDelete(args.id); // ✅ No .exec(), no reuse
            },
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                clientId: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            'NOT_STARTED': { value: 'Not Started' },
                            'IN_PROGRESS': { value: 'In Progress' },
                            'COMPLETED': { value: 'Completed' },
                        },
                    }),
                }
            },
            async resolve(parent, args) {
                const updateData = {};
                if (args.clientId) updateData.clientId = args.clientId;
                if (args.name) updateData.name = args.name;
                if (args.description) updateData.description = args.description;
                if (args.status) updateData.status = args.status;

                return await Project.findByIdAndUpdate(args.id, updateData, { new: true });
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});