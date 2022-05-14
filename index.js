const express = require('express');
const db = require('./db');
require('dotenv').config();
const app = express();

//Import auth routes
const authRoutes = require('./routes/auth.routes');
//Import post routes
const postRoutes = require('./routes/post.routes');

//Middleware
app.use(express.json());

//Use auth routes
app.use('/api/auth',authRoutes);
app.use('/api/posts',postRoutes);


//Start server
const startApp = async () => {
  try{
    await db.connect()
      .then(() => console.log("Connected to database"))
      .then(() => app.listen(process.env.PORT, 
        () => console.log(`Server started on port ${process.env.PORT}`)))
      .catch(err => console.log(err));
  }
  catch(err) {
    console.log(err);
  }
}

startApp();