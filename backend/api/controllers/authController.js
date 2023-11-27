const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User  = require('../models').User; // Assuming you have a models file

// Secret key for JWT
const secretKey = 'your-secret-key';

async function registerUser(req, res) {
  const { username,email, password, role} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
    console.log(error);
  }
}

async function loginUser(req, res) {
 
    const { email, password } = req.body;
    if(!email &&!password){
      return res.status(200).json({ message: 'Wrong email and password' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({ message: 'Wrong email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({ message: 'Wrong password' });
    }
    if (user.isActive == false) {
      return res.status(200).json({ message: 'Inactive account' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secretKey);

    // Create a new user object without the password field
    const userWithoutPassword = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      // Add other user properties you need
    };

    res.status(200).json({ token, user: userWithoutPassword, message: 'Successfully authenticated' });
}

module.exports = { registerUser, loginUser };