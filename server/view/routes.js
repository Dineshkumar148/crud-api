import express from 'express';
import { createEmp, getAllEmp, getEmpById, updateEmp, deleteEmp, bulkCreateEmp, } from '../controller/userController.js';
import { sendWhatsAppMessage } from '../controller/whatsapp.js';

const router = express.Router();

// Create a new employee
router.post('/employee', createEmp);
router.post('/employee/bulk', bulkCreateEmp);

// Get all employees
router.get('/employee', getAllEmp);

// Get a particular employee by ID
router.get('/employee/:id', getEmpById);

// Update an employee by ID
router.put('/employee/:id', updateEmp);

// Delete an employee by ID
router.delete('/employee/:id', deleteEmp);

// whats's App Api Url for send message 
router.post('/whatsapp', sendWhatsAppMessage);


export default router;
