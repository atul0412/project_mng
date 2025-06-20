const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLEnumType,
} = require('graphql');
const Client = require('../models/clients');

// Enum for project status
const ProjectStatusEnum = new GraphQLEnumType({
  name: 'ProjectStatus',
  values: {
    NOT_STARTED: { value: 'Not Started' },
    IN_PROGRESS: { value: 'In Progress' },
    COMPLETED: { value: 'Completed' },
  },
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

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    clientId: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: ProjectStatusEnum },
    client: {
      type: ClientType,
      async resolve(parent) {
        return await Client.findById(parent.clientId);
      },
    },
  }),
});

module.exports = { ClientType, ProjectType, ProjectStatusEnum };
