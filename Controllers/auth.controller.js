// Instantiate dabatabase connection
const db = require('../db');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const allUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
  }
}

const register = async (req, res) => {
  const user = req.body;
  const {error} = registerValidation(user);
  if(error) {
    res.status(400).json({
      message: error.details[0].message
    });
    return;
  }
  //Verify if username is already in use
  const username = await db.query('SELECT * FROM users WHERE username = $1', [user.username]);
  if(username.rowCount > 0) {
    res.status(400).json({
      message: 'Username is already in use'
    });
    return;
  }
  //Verify if email is already in use
  const email = await db.query('SELECT * FROM users WHERE email = $1', [user.email]);
  if(email.rowCount > 0) {
    res.status(400).json({
      message: 'Email is already in use'
    });
    return;
  }
  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  //Create a new user
  try {
    const result = await db.query('INSERT INTO users (username,password,email) VALUES ($1, $2,$3) Returning *', 
      [user.username, hashedPassword, user.email]);

    res.json(result.rows[0]);
  }
  catch(err) {
    res.status(400).json({message:err.message});
  }
  
}

const login = async (req, res) => {
  const user = req.body;
  //Validate user data
  const {error} = loginValidation(user);
  if(error) {
    res.status(400).json({
      message: error.details[0].message
    });
    return;
  }
  try {

    const result = await db.query('SELECT * FROM users WHERE username = $1', [user.username]);
    //Check if user exists
    if(result.rowCount > 0) {
      //Check if password is correct
      //Compare entered password with hashed password in db
      const validPassword = await bcrypt.compare(user.password, result.rows[0].password);
      if(validPassword) {
        //Create and assign a token
        const token = jwt.sign({id:result.rows[0].id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.header('auth-token', token).send(token);


      } else {
        //Password is incorrect
        res.status(400).json({message:'Incorrect password'});
      }
    }
    else {
      //User does not exist
      res.status(400).json({message:'User not found'});
    }
  }
  catch(err) {
    res.status(400).json({message:err.message});
  }
}


module.exports = {
  register,
  login,
  allUsers
} 