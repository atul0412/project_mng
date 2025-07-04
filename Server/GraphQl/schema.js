const { gql } = require('graphql-tag');

const typeDefs = gql`
  enum Role {
    CLIENT
    ADMIN
  }

  type Query {
    clients: [Client]
    client(_id: ID!): Client
    projects: [Project!]!
    project(id: ID!): Project
    me: Client
  }

  type Client {
    id: ID!
    name: String
    email: String
    phone: String
    role: Role
    projects: [Project]
  }

  type Project {
    id: ID!
    name: String!
    description: String
    status: String
    client: Client
  }

  type Token {
    token: String!
  }

  type Mutation {
    signupClient(newClient: SignupInput!): Client
    loginClient(clientLogin: LoginInput!): Token
    addProject(newProject: ProjectInput!): Project
    deleteProject(id: ID!): String
    updateProject(id: ID!, input: UpdateProjectInput!): Project
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    phone: String
    role: Role
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ProjectInput {
    name: String!
    description: String
    status: String
    clientId: ID!
  }

  input UpdateProjectInput {
    name: String
    description: String
    status: String
  }
`;

module.exports = typeDefs;
