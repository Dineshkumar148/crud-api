import express from 'express';
import { createEmp, getAllEmp, getEmpById, updateEmp, deleteEmp } from '../controller/userController.js';
import { sendWhatsAppMessage } from '../controller/whatsapp.js';

const router = express.Router();

// Create a new employee
router.post('/employees', createEmp);

// Get all employees
router.get('/employees', getAllEmp);

// Get a particular employee by ID
router.get('/employees/:id', getEmpById);

// Update an employee by ID
router.put('/employees/:id', updateEmp);

// Delete an employee by ID
router.delete('/employees/:id', deleteEmp);

// whats's App Api Url for send message 
router.post('/whatsapp', sendWhatsAppMessage);


export default router;
