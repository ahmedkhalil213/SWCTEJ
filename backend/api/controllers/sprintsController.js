const db = require('../models'); // Assuming you have a models file
const Sprint = db.Sprint;
const Project = db.Project;
async function createSprint(req, res) {
    try {
      const projectId = req.body.projectId; // Get the Project's id from the request body
  
      // Find the Project by its id
      const project = await Project.findByPk(projectId);
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Create a new Sprint associated with the found Project
      const sprint = await Sprint.create({
        label: req.body.label,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        description: req.body.description,
        projectId: projectId, // Set the projectId to associate with the Project
      });
  
      res.status(201).json({ message: 'Sprint created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  } 
  async function toggleSprintStatus(req, res) {
    try {
      const { projectId, sprintId } = req.params; // Get the projectId and sprintId from the request parameters
  
      // Find the Project by its id
      const project = await Project.findByPk(projectId);
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Find the Sprint by its id, but within the context of the specified Project
      const sprint = await Sprint.findOne({
        where: {
          id: sprintId,
          ProjectId: projectId,
        },
      });
  
      if (!sprint) {
        return res.status(404).json({ error: 'Sprint not found' });
      }
  
      // Toggle the isActive status of the Sprint
      sprint.isActive = !sprint.isActive;
      await sprint.save();
  
      res.json({ message: 'Sprint status toggled', sprint });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
  async function updateSprint(req, res) {
    try {
      const projectId = req.params.projectId; // Get the project ID from the route parameters
      const sprintId = req.params.sprintId; // Get the sprint ID from the route parameters
  
      // Find the Project by its id
      const project = await Project.findByPk(projectId);
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      // Find the Sprint by its id and the associated project
      const sprint = await Sprint.findOne({
        where: {
          id: sprintId,
          projectId: projectId,
        },
      });
  
      if (!sprint) {
        return res.status(404).json({ error: 'Sprint not found in the project' });
      }
  
      // Extract the updated information from the request body
      const { label, startDate, endDate, description } = req.body;
  
      // Update the Sprint's information
      sprint.label = label;
      sprint.startDate = startDate;
      sprint.endDate = endDate;
      sprint.description = description;
  
      await sprint.save();
  
      res.json({ message: 'Sprint updated', sprint });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
  async function deleteSprints(req, res) {
    const {sprintIds } = req.body; // Get project IDs and sprint IDs from the request body
    const projectIds =req.params;
    try {
      const deletedSprints = await Sprint.destroy({
        where: {
          id: sprintIds, // An array of sprint IDs to delete
          projectId: projectIds, // Specify the project to narrow down the deletion
        },
      });
  
      res.json({ message: 'Sprints deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete sprints' });
    }
  }
  async function showSprintsByProject(req, res) {
    const projectId = req.params.projectId; // Get projectId from route parameter
    const { filter1, filter2, filter3 } = req.query; // Example query filters
  
    const whereConditions = { ProjectId: projectId };
  
    // Add optional filters to the query
    if (filter1) {
      whereConditions.filter1 = filter1;
    }
    if (filter2) {
      whereConditions.filter2 = filter2;
    }
    if (filter3) {
      whereConditions.filter3 = filter3;
    }
  
    try {
      const sprints = await Sprint.findAll({
        where: whereConditions,
      });
  
      return res.status(200).json(sprints);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
  async function getSprintWithTasks(req, res) {
    try {
      const projectId = req.params.projectId;
      const sprintId = req.params.sprintId;
  
      // Retrieve the sprint along with its associated tasks
      const sprint = await Sprint.findOne({
        where: {
          id: sprintId,
          ProjectId: projectId, // Filter by project ID to ensure the sprint belongs to the project
        },
        include: [Task], // Include associated tasks
      });
  
      if (!sprint) {
        return res.status(404).json({ error: 'Sprint not found' });
      }
  
      res.json({ sprint });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
  async function getSprintsIdLabel(req, res) {
    try {
      // Fetch all sprints with only ID and label attributes
      const sprints = await Sprint.findAll({
        attributes: ['id', 'label'],
      });
  
      // Send the sprints as a JSON response
      res.json(sprints);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Controller function to disassociate a Sprint from a Project
  module.exports = { createSprint,toggleSprintStatus,updateSprint,deleteSprints,showSprintsByProject,getSprintWithTasks,getSprintsIdLabel};