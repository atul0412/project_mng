const Client = require('../models/clients');
const Project = require('../models/project');

module.exports = {
  // Clients
  getClients: async () => {
    return await Client.find();
  },

  getClient: async (_, { id }) => {
    return await Client.findById(id);
  },

  addClient: async (_, args) => {
    const client = new Client(args);
    return await client.save();
  },

  deleteClient: async (_, { id }) => {
    return await Client.findByIdAndDelete(id);
  },

  // Projects
  getProjects: async () => {
    return await Project.find();
  },

  getProject: async (_, { id }) => {
    return await Project.findById(id);
  },

  addProject: async (_, args) => {
    const project = new Project(args);
    return await project.save();
  },

  deleteProject: async (_, { id }) => {
    return await Project.findByIdAndDelete(id);
  },

  updateProject: async (_, args) => {
    const updateData = {};
    if (args.name) updateData.name = args.name;
    if (args.description) updateData.description = args.description;
    if (args.status) updateData.status = args.status;

    return await Project.findByIdAndUpdate(args.id, updateData, {
      new: true,
    });
  },
};
