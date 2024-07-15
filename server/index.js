import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB, syncDB } from './postgress/postgress.js';
import router from './view/routes.js';

const app = express();
const PORT = 8000;

// Use the cors middleware
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// Use the employee routes
app.use('/api', router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect and sync the database
connectDB();
syncDB();
