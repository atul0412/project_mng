const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const { ClientType, ProjectType, ProjectStatusEnum } = require('./types');
const resolvers = require('./resolver');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => await resolvers.getClient(parent, args),
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve: async () => await resolvers.getClients(),
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve: async (parent, args) => await resolvers.getProject(parent, args),
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: async () => await resolvers.getProjects(),
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args) => await resolvers.addClient(parent, args),
    },
    deleteClient: {
      type: ClientType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => await resolvers.deleteClient(parent, args),
    },
    addProject: {
      type: ProjectType,
      args: {
        clientId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: ProjectStatusEnum, defaultValue: 'Not Started' },
      },
      resolve: async (parent, args) => await resolvers.addProject(parent, args),
    },
    deleteProject: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args) => await resolvers.deleteProject(parent, args),
    },
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: ProjectStatusEnum },
      },
      resolve: async (parent, args) => await resolvers.updateProject(parent, args),
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
