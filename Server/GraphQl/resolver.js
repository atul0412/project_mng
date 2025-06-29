const Client = require("../models/clients");
const Project = require("../models/project");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    clients: async () => await Client.find({}),
    client: async (_, { _id }) => await Client.findById(_id),
    projects: async () => await Project.find({}),
    project: async (_, id) => await Project.findById(id),
  },
  Client: {
    projects: async (client) => await Project.find({ clientId: client._id })
  },
  Mutation: {
    // Mutation for clinet signup and login 
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
          { id: existingClient._id, email: existingClient.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return { token };
      } catch (err) {
        throw new Error(err.message || "Login error");
      }
    },

    // mutation for adding, updating and deleting projects 
    addProject: async (_, { newProject }) => {
      const clientExists = await Client.findById(newProject.clientId);
      if (!clientExists) {
        throw new Error("Client not found");
      }

      const project = new Project(newProject);
      return await project.save();
    },
    deleteProject: async (_, { id }) => {
      try {
        const deleted = await Project.findByIdAndDelete(id);
        if (!deleted) {
          throw new Error("Project not found");
        }
        return "Project deleted successfully";
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateProject: async (_, { id, input }) => {
      try {
        const updatedProject = await Project.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true } // return the updated document
        );

        if (!updatedProject) {
          throw new Error("Project not found");
        }

        return updatedProject;
      } catch (err) {
        throw new Error(err.message || "Failed to update project");
      }
    },
  },
};

module.exports = resolvers;
