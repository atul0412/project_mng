const Client = require("../models/clients");
const Project = require("../models/project");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    clients: async (_, __, context) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error("You are not a admin ");
      }
      return await Client.find({});
    },

    client: async (_, { _id }, context) => {
      if (!context.user || (context.user.role !== 'ADMIN' && context.user.id !== _id)) {
        throw new Error("Unauthorized");
      }
      return await Client.findById(_id);
    },

    projects: async (_, __, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      if (context.user.role === 'ADMIN') {
        return await Project.find({});
      }

      // CLIENT - only their own projects
      return await Project.find({ clientId: context.user.id });
    },

    project: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      const project = await Project.findById(id);
      if (!project) {
        throw new Error("Project not found");
      }

      if (context.user.role === 'ADMIN' || project.clientId.toString() === context.user.id) {
        return project;
      }

      throw new Error("Unauthorized");
    },

    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return await Client.findById(context.user.id);
    }
  },

  Client: {
    projects: async (client, _, context) => {
      if (
        context.user.role !== 'ADMIN' &&
        context.user.id !== client._id.toString()
      ) {
        throw new Error("Unauthorized");
      }
      return await Project.find({ clientId: client._id });
    }
  },

  Mutation: {
    signupClient: async (_, { newClient }) => {
      try {
        const existingClient = await Client.findOne({ email: newClient.email });

        if (existingClient) {
          throw new Error("Client already exists with that email");
        }

        const hashedPassword = await bcrypt.hash(newClient.password, 12);

        const client = new Client({
          ...newClient,
          password: hashedPassword,
          role: newClient.role || 'CLIENT', // default to CLIENT
        });

        return await client.save();
      } catch (err) {
        throw new Error(err.message || "Error signing up client");
      }
    },

    loginClient: async (_, { clientLogin }) => {
      try {
        const existingClient = await Client.findOne({ email: clientLogin.email });
        if (!existingClient) {
          throw new Error("Invalid email");
        }

        const isMatch = await bcrypt.compare(clientLogin.password, existingClient.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          {
            id: existingClient._id,
            email: existingClient.email,
            role: existingClient.role
          },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return { token };
      } catch (err) {
        throw new Error(err.message || "Login error");
      }
    },

    addProject: async (_, { newProject }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      const clientId = newProject.clientId;

      if (
        context.user.role !== 'ADMIN' &&
        context.user.id !== clientId
      ) {
        throw new Error("You can only add projects for yourself");
      }

      const clientExists = await Client.findById(clientId);
      if (!clientExists) {
        throw new Error("Client not found");
      }

      const project = new Project(newProject);
      return await project.save();
    },

    deleteProject: async (_, { id }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      const project = await Project.findById(id);
      if (!project) {
        throw new Error("Project not found");
      }

      if (
        context.user.role !== 'ADMIN' &&
        project.clientId.toString() !== context.user.id
      ) {
        throw new Error("You can only delete your own projects");
      }

      await project.deleteOne();
      return "Project deleted successfully";
    },

    updateProject: async (_, { id, input }, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      const project = await Project.findById(id);
      if (!project) {
        throw new Error("Project not found");
      }

      if (
        context.user.role !== 'ADMIN' &&
        project.clientId.toString() !== context.user.id
      ) {
        throw new Error("You can only update your own projects");
      }

      Object.assign(project, input);
      return await project.save();
    },
  },
};

module.exports = resolvers;
