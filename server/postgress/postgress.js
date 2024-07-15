// postgress.js
import { Sequelize } from 'sequelize';

// Database Connection
const sequelize = new Sequelize('postgres', 'postgres', 'ohoh@2024', {
  host: 'localhost',
  dialect: 'postgres',
});

// Connection Auth
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// sync db data 
const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true }); 
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('An error occurred while synchronizing the models:', error);
    }
};

export { sequelize, connectDB, syncDB };
