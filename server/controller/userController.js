import Employee from '../models/employee.js';

// Create a new employee
export const createEmp = async (req, res) => {
  const { firstname, lastname, email, designation } = req.body;

  // Check for missing fields
  if (!firstname, !lastname, !email, !designation) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log('Attempting to create employee with data:', req.body); // Log the request body
    const newEmployee = await Employee.create({
      firstname,
      lastname,
      email,
      designation,
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error); // Log the error details
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all employees
export const getAllEmp = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: ['id', 'firstname', 'lastname', 'email', 'designation'],
    });
    res.json(employees);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get an employee by ID
export const getEmpById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findOne({
      where: { id },
      attributes: ['id', 'firstname', 'lastname', 'email', 'designation'],
    });
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an employee by ID
export const updateEmp = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Employee.update(req.body, { where: { id } });
    if (updated) {
      const updatedEmployee = await Employee.findOne({ where: { id } });
      res.status(200).json(updatedEmployee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an employee by ID
export const deleteEmp = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employee.destroy({ where: { id } });
    if (deleted) {
      res.status(204).json({ message: 'Employee deleted' });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
