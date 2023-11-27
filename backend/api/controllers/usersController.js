const User  = require('../models').User;
const bcrypt = require('bcrypt');
const ProjectUser  = require('../models').ProjectUser; // Assuming you have a models file

// Secret key for JWT
const secretKey = 'your-secret-key';

async function addUser(req, res) {
  const { username,email, password, role} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const authenticatedUser = req.user;

  try {
    const user = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
    console.log(error);
  }
}


async function actdisactAgent(req, res) {
  const { userId } = req.body;
  const authenticatedUser = req.user;

  try {
    if (
      (authenticatedUser.role === 'superadmin' || authenticatedUser.role === 'scrummaster') &&
      authenticatedUser.isActive === true
    ) {
      const user = await User.findByPk(userId);

      if (user) {
        // Toggle the isActive status of the user
        user.isActive = !user.isActive;
        await user.save();

        res.json({ message: 'User isActive status modified successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to modify user isActive status' });
  }
}
async function deleteUsers(req, res) {
  const { userIds } = req.body; // An array of user IDs to delete
  try {
    // Find and delete the specified users
    await User.destroy({
      where: {
        id: userIds, // An array of user IDs to delete
      },
    });

    res.json({ message: 'Users deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
async function getUsers(req, res) {
  const { username, email, role, isActive } = req.query;
  const whereConditions = {};

  if (username) {
    whereConditions.username = username;
  }

  if (email) {
    whereConditions.email = email;
  }

  if (role) {
    whereConditions.role = role;
  }

  if (isActive !== undefined) {
    whereConditions.isActive = isActive;
  }

  try {
    const users = await User.findAll({
      where: whereConditions,
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
async function updateUser(req, res) {
  try {
    const { userId } = req.params; // Get the user ID from the route parameters
    const userData = req.body; // New user data to update

    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user data
    await user.update(userData);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { addUser,getUsers,actdisactAgent,deleteUsers,updateUser};
