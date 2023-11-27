const models = require('../models');
const sequelize = require('../models').sequelize

const { Task, Sprint, User, Project, Sequelize } = require('../models'); 

async function associateUser(req, res) {
  const { projectId, sprintId, taskId,userId  } = req.body;
  try {
    const task = await Task.findByPk(taskId);
    const user = await User.findByPk(userId);
    const project = await Project.findByPk(projectId);
    const sprint = await Sprint.findByPk(sprintId);

    if (!task || !user || !project || !sprint) {
      return res.status(404).json({ error: 'Task, User, Project, or Sprint not found' });
    }

    // Check if the task belongs to the specified sprint and project
    if (task.ProjectId !== project.id || task.SprintId !== sprint.id) {
      return res.status(400).json({ error: 'Task does not belong to the specified Project and Sprint' });
    }

    await task.addUser(user);
    res.json({ message: 'User associated with the task' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function disassociateUser(req, res) {
  const { projectId, sprintId, taskId } = req.params;
  const { userId } = req.body;

  try {
    const task = await Task.findByPk(taskId);
    const user = await User.findByPk(userId);
    const project = await Project.findByPk(projectId);
    const sprint = await Sprint.findByPk(sprintId);

    if (!task || !user || !project || !sprint) {
      return res.status(404).json({ error: 'Task, User, Project, or Sprint not found' });
    }

    // Check if the task belongs to the specified sprint and project
    if (task.ProjectId !== project.id || task.SprintId !== sprint.id) {
      return res.status(400).json({ error: 'Task does not belong to the specified Project and Sprint' });
    }

    await task.removeUser(user);
    res.json({ message: 'User associated with the task' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function toggleTaskStatus(req, res) {
  const { taskId } = req.params;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.isActive = !task.isActive; // Toggle the task status (active or inactive)
    await task.save();
    res.json({ message: 'Task status toggled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function getTaskById(req, res) {
  const { taskId } = req.params;

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function createTask(req, res) {
  const { label, startDate, endDate, description, estimation, sprintId } = req.body;

  try {
    // Create the task without specifying the sprint association
    const task = await Task.create({
      label,
      startDate,
      endDate,
      description,
      estimation,
    });

    // Associate the task with the specified sprint
    const sprint = await Sprint.findByPk(sprintId);

    if (!sprint) {
      return res.status(404).json({ error: 'Sprint not found' });
    }

    await task.setSprint(sprint);

    res.status(201).json({message:'task created'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}


async function updateTask(req, res) {
  const { taskId } = req.params;
  const { label, startDate, endDate, description, estimation } = req.body;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.label = label;
    task.startDate = startDate;
    task.endDate = endDate;
    task.description = description;
    task.estimation = estimation;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}


async function deleteManyTasks(req, res) {
  const { taskIds } = req.body;

  try {
    await Task.destroy({
      where: {
        id: taskIds,
      },
    });
    res.json({ message: 'Tasks deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
async function changeTaskState(req, res) {
    try {
      const { taskId } = req.params; // Extract taskId and newState from the request parameters
  const newState=req.body;
      // Implement the logic for changing the state
      const task = await Task.findByPk(taskId);
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      if (newState === 'Done') {
        task.Done = true;
        task.ToDo = false;
        task.inProgress = false;
      } else if (newState === 'ToDo') {
        task.ToDo = true;
        task.Done = false;
        task.inProgress = false;
      } else if (newState === 'inProgress') {
        task.inProgress = true;
        task.Done = false;
        task.ToDo = false;
      } else {
        return res.status(400).json({ error: 'Invalid state' });
      }
  
      // Save the changes to the database
      await task.save();
  
      return res.status(200).json({ message: 'Task state changed successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
  async function assignTaskToSprint(req, res) {
    try {
      const { taskId, sprintId } = req.params;
  
      // Find the task and the sprint by their IDs
      const task = await Task.findByPk(taskId);
      const sprint = await Sprint.findByPk(sprintId);
  
      if (!task || !sprint) {
        return res.status(404).json({ success: false, message: 'Task or sprint not found' });
      }
  
      // Assign the task to the sprint
      await task.setSprint(sprint);
  
      res.status(200).json({ success: true, message: 'Task assigned to sprint successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to assign the task to the sprint' });
    }
  }
  async function getAllTasksStats(req, res) {
    try {
        const projectId = req.params.projectId;

        // Count active tasks in different states
        const tasksToDoCount = await models.Task.count({
            where: {
                isActive: true,
                ToDo: true,
            },
            include: [
                {
                    model: models.Sprint,
                    where: {
                        ProjectId: projectId,
                    },
                    include: [{ model: models.Project }],
                },
            ],
        });

        const tasksInProgressCount = await models.Task.count({
            where: {
                isActive: true,
                inProgress: true,
            },
            include: [
                {
                    model: models.Sprint,
                    where: {
                        ProjectId: projectId,
                    },
                    include: [{ model: models.Project }],
                },
            ],
        });

        const tasksDoneCount = await models.Task.count({
            where: {
                isActive: true,
                Done: true,
            },
            include: [
                {
                    model: models.Sprint,
                    where: {
                        ProjectId: projectId,
                    },
                    include: [{ model: models.Project }],
                },
            ],
        });

      
        const totalTasksCount = tasksToDoCount + tasksInProgressCount + tasksDoneCount;

        // Prepare the response
        if(totalTasksCount>0){
      const taskStats = [
            Math.round((tasksToDoCount / totalTasksCount) * 100),
            Math.round((tasksInProgressCount / totalTasksCount) * 100),
            Math.round((tasksDoneCount / totalTasksCount) * 100),
        ]; 
        res.json(taskStats);
      }else{
        res.json([tasksToDoCount , tasksInProgressCount , tasksDoneCount])
      }
        // Send the task statistics as a JSON response
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
async function getTasksForDataTable(req, res) {
  try {
    // Extract query parameters from the request
    const {
      projectId,
      sprintId,
      startDate,
      endDate,
      isDone,
      isToDo,
      isInProgress,
      isActive,
      userId,
      sortColumn,
      sortOrder,
    } = req.query;

    // Build the where condition based on the provided filters
    const whereCondition = {};
    if (projectId) whereCondition.ProjectId = projectId;
    if (sprintId) whereCondition.SprintId = sprintId;
    if (startDate) whereCondition.startDate = { [Op.gte]: startDate };
    if (endDate) whereCondition.endDate = { [Op.lte]: endDate };
    if (isDone !== undefined) whereCondition.Done = isDone;
    if (isToDo !== undefined) whereCondition.ToDo = isToDo;
    if (isInProgress !== undefined) whereCondition.inProgress = isInProgress;
    if (isActive !== undefined) whereCondition.isActive = isActive;
    if (userId) whereCondition['$User.id$'] = userId;

    // Build the order array based on the provided sort options
    const order = [];
    if (sortColumn && sortOrder) {
      order.push([sortColumn, sortOrder]);
    }

    // Fetch tasks based on the filters and sorting options
    const tasks = await Task.findAll({
      where: whereCondition,
      include: [
        {
          model: Sprint,
          attributes: ['id', 'label'], // Adjust attributes as needed
        },
        {
          model: User,
          attributes: ['id', 'username'], // Adjust attributes as needed
        },
        {
          model: Project,
          attributes: ['id', 'label'], // Adjust attributes as needed
        },
      ],
      attributes: [
        'id',
        'label',
        'description',
        'startDate',
        'endDate',
        'Done',
        'ToDo',
        'inProgress',
        'isActive',
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%d/%m/%Y %H:%i:%s'), 'formattedCreatedAt'],
      ],
      order,
    });

    // Send the tasks as a JSON response
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function getAllTaskstest(req, res) {
  try {
    sequelize.query(
      'CREATE OR REPLACE FUNCTION convertMinutes(minutes INT) RETURNS VARCHAR(255) ' +
      'BEGIN ' +
      'DECLARE weeks INT; ' +
      'DECLARE days INT; ' +
      'DECLARE hours INT; ' +
      'DECLARE result VARCHAR(255); ' +
      'SET weeks = FLOOR(minutes / (60 * 24 * 7)); ' +
      'SET minutes = minutes % (60 * 24 * 7); ' +
      'SET days = FLOOR(minutes / (60 * 24)); ' +
      'SET minutes = minutes % (60 * 24); ' +
      'SET hours = FLOOR(minutes / 60); ' +
      'SET minutes = minutes % 60; ' +
      'SET result = CONCAT(' +
      'IF(weeks > 0, CONCAT(weeks, "w"), ""), ' +
      'IF(days > 0, CONCAT(days, "d"), ""), ' +
      'IF(hours > 0, CONCAT(hours, "h"), ""), ' +
      'IF(minutes > 0, CONCAT(minutes, "m"), "") ' +
      '); ' +
      'RETURN result; ' +
      'END'
    );
    // Fetch all tasks with associated data
    const tasks = await Task.findAll({
      include: [
        {
          model: Sprint,
          attributes: ['id', 'label'], // Adjust attributes as needed
          include: [
            {
              model: Project,
              attributes: ['id', 'label'], // Adjust attributes as needed
            },
          ],
        },
        {
          model: User,
          attributes: ['id', 'username'], // Adjust attributes as needed
        },
      ],
      attributes: [
        'id',
        'label',
        'description',
        'Done',
        'ToDo',
        'inProgress',
        'isActive',
        [sequelize.fn('convertMinutes', Sequelize.col('estimation')), 'estimation'],
        [Sequelize.fn('DATE_FORMAT', Sequelize.literal('`Task`.`createdAt`'), '%d/%m/%Y '), 'createdAt'],
         [Sequelize.fn('DATE_FORMAT', Sequelize.literal('`Task`.`startDate`'), '%d/%m/%Y'), 'startDate'],
          [Sequelize.fn('DATE_FORMAT', Sequelize.literal('`Task`.`endDate`'), '%d/%m/%Y'), 'endDate']
      ],
    });
    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }
    const projectLabelsArray= tasks.map((task) => task.Sprint.Project.label).filter(onlyUnique)
    // Send the tasks as a JSON response
    res.json({tasks:tasks,projectLabels:projectLabelsArray});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
  
module.exports = {
  associateUser,
  disassociateUser,
  toggleTaskStatus,
  getTaskById,
  createTask,
  changeTaskState,
  assignTaskToSprint,
  deleteManyTasks,
updateTask,
getAllTasksStats,
getTasksForDataTable,
getAllTaskstest
}