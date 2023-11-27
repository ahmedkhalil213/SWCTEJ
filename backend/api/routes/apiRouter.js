const app = require('express');
const router = app.Router();
const authenticateToken = require('../middleware/authenticateRoleToken'); // Import the middleware
const usersController=require('../controllers/usersController')
const projectsController=require('../controllers/projectsController')
const sprintsController=require('../controllers/sprintsController')
const tasksController=require('../controllers/tasksController')
const notesController=require('../controllers/notesContoller')

// Define an admin route protected with the authenticateToken middleware
//users management
router.use(authenticateToken());
router.post('/users/adduser',usersController.addUser);
router.patch('/users/actdisactAgent/:userId', usersController.actdisactAgent);
router.delete('/users/deleteUsers',usersController.deleteUsers);
router.get('/users/getUsers',usersController.getUsers);
router.put('/users/updateUser/:userId',  usersController.updateUser);
//project management
router.post('/projects/createProject', projectsController.createProject);

// Get projects based on query parameters
router.get('/projects/getProjects', projectsController.getProjects);
router.get('/projects/getProjectsIdLabel', projectsController.getProjectsIdLabel);

// Update a project by ID
router.put('/projects/updateProject/:projectId', projectsController.updateProject);

// Delete a project by ID
router.delete('/projects/deleteProjects', projectsController.deleteProjects);

// Associate a user with a project
router.post('/projects/:projectId/associateusers', projectsController.associateUser);

// Disassociate a user from a project
router.post('/projects/:projectId/disassociateusers', projectsController.disassociateUser);
// Create a new sprint
router.post('/sprint/createSprint', sprintsController.createSprint);

// Toggle sprint status
router.put('/projects/:projectId/sprints/:sprintId/toggleStatus', sprintsController.toggleSprintStatus);

// Update a sprint
router.get('/sprints/getSprintsIdLabel', sprintsController.getSprintsIdLabel);

// Delete sprints
router.delete('/projects/:projectIds/sprints/delete', sprintsController.deleteSprints);
// Show sprints filtered by project
router.get('/projects/:projectId/sprints', sprintsController.showSprintsByProject); 
router.get('/projects/:projectId/sprints/:sprintId/tasks', sprintsController.getSprintWithTasks);

// Disassociate a user from a task
router.post('/tasks/:taskId/associate', tasksController.associateUser);
router.post('/tasks/:taskId/disassociate', tasksController.disassociateUser);
// Toggle task status
router.put('/tasks/:taskId/toggle', tasksController.toggleTaskStatus);

// Get all task
router.get('/tasks/alltasks', tasksController.getAllTaskstest);
// Get a task by ID
router.get('/notes/getNotesbyDate', notesController.getNotesbyProjectDate);

// Create a new task
router.post('/tasks/createTask', tasksController.createTask);

router.get('/tasks/getTasksStats/:projectId', tasksController.getAllTasksStats);
module.exports = router;