require('dotenv').config({path:'../.env'});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ruleController = require('./controllers/ruleController');
const intilalizeDatabase = require('./db/initializeDatabase');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/api/rules', ruleController);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'An unexpected error occurred' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try{
      await intilalizeDatabase();
      app.listen(PORT, ()=>{
        console.log(`server is running on ${PORT}`);
      });
    
  } catch(error){
      console.error('Failed to start server:', error);
  }  
  
}

startServer();