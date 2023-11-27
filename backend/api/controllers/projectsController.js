const Project  = require('../models').Project;
const UserProject  = require('../models').UserProject;
const User = require('../models').User; 
const { Op } = require('sequelize');

// Create a new project
async function createProject(req, res) {
  try {
    const createdByUserId = req.user.id; // Get the user ID of the project creator

    const project = await Project.create({
      ...req.body,
    });
    // Associate the project with the user who created it
    await project.addUser(createdByUserId); 
    res.status(200).json({ message: 'Project created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create a project' });
  }
}

async function getProjects(req, res) {
  const { label, startDate, endDate, isActive } = req.query;
  const whereConditions = {};

  if (label) {
    whereConditions.label = label;
  }

  if (startDate) {
    whereConditions.startDate = startDate;
  }

  if (endDate) {
    whereConditions.endDate = endDate;
  }

  if (isActive !== undefined) {
    whereConditions.isActive = isActive;
  }

  try {
    const projects = await Project.findAll({
      where: whereConditions,
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
async function getProjectsIdLabel(req, res) {
 

  try {
    const projects = await Project.findAll();
    const formattedProjects = projects.map(project => ({
      id: project.id,
      label: project.label
    }));
    res.status(201).json(formattedProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}


// Update a project by ID
async function updateProject(req, res) {
  const { projectId } = req.params;
  try {
    
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await project.update(req.body);
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the project' });
  }
}

// Delete a project by ID
async function deleteProjects(req, res) {
  const { projectIds } = req.body; // Get project IDs from the request body
  try {
    // Use the `destroy` method with the `where` clause to delete multiple projects
    await Project.destroy({
      where: {
        id: projectIds, // An array of project IDs to delete
      },
    });

    res.json({ message: 'Projects deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete projects' });
  }
}

async function associateUser(req, res) {
  const { projectId } = req.params;
  const { userIds } = req.body; // Expect an array of user IDs

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if the users are already associated with the project
    const users = await project.getUsers({ where: { id: userIds } });

    if (users.length === 0) {
      await project.addUsers(userIds); // Use addUsers to associate multiple users
      return res.status(200).json({ success: true, message: 'Users associated with the project' });
    } else {
      return res.status(200).json({ success: false, message: 'Users are already associated with the project' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to associate the users with the project' });
  }
}

// Function to disassociate a user from a project
async function disassociateUser(req, res) {
  const { projectId } = req.params;
  const { userIds } = req.body; // Expect an array of user IDs

  try {
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if the users are associated with the project
    const users = await project.getUsers({ where: { id: userIds } });

    if (users.length > 0) {
      await project.removeUsers(userIds); // Use removeUsers to disassociate multiple users
      return res.status(200).json({ success: true, message: 'Users disassociated from the project' });
    } else {
      return res.status(200).json({ success: false, message: 'Users are not associated with the project' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to disassociate the users from the project' });
  }
}


module.exports = { createProject, getProjects, updateProject, deleteProjects,associateUser,
  disassociateUser,getProjectsIdLabel};