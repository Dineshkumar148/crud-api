import Employee from "../models/employee.js";

// Create a new employee
export const createEmp = async (req, res) => {
  const { firstname, lastname, email, designation } = req.body;

  // Check for missing fields
  if (!firstname || !lastname || !email || !designation) {
    return res.status(400).json({ error: error.message ||  "All fields are required" });
  }

  try {
    // Check if the email already exists
    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res
        .status(409)
        .json({ error: "Email already exists. Please try a different one." });
    }

    console.log("Attempting to create employee with data:", req.body);
    const newEmployee = await Employee.create({
      firstname,
      lastname,
      email,
      designation,
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

// Get all employees in alphabetical order by firstname
export const getAllEmp = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: ["id", "firstname", "lastname", "email", "designation"],
      order: [["id", "ASC"]], // Sort by firstname in ascending order
    });
    res.json(employees);
  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .json({ error: error.message || "Internal server error" });
  }
};

// Get an employee by ID
export const getEmpById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findOne({
      where: { id },
      attributes: ["id", "firstname", "lastname", "email", "designation"],
    });
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: error.message ||  "Employee not found" });
    }
  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .json({ error: "Internal server error" });
  }
};

// Update an employee by ID
export const updateEmp = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, designation } = req.body;

  // Check for missing fields
  if (!firstname && !lastname && !email && !designation) {
    return res
      .status(400)
      .json({ error: "At least one field is required to update" });
  }

  try {
    const employee = await Employee.findOne({ where: { id } });

    if (!employee) {
      return res.status(404).json({ error: error.message || "Employee not found" });
    }

    // Update employee details
    employee.firstname = firstname || employee.firstname;
    employee.lastname = lastname || employee.lastname;
    employee.email = email || employee.email;
    employee.designation = designation || employee.designation;

    await employee.save();

    res.status(200).json(employee);
  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .json({ error: error.message || "Internal server error" });
  }
};

// Delete an employee by ID
export const deleteEmp = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Employee.destroy({ where: { id } });
    if (deleted) {
      res.status(204).json({ message: "Employee deleted" });
    } else {
      res.status(404).json({ error: error.message || "Employee not found" });
    }
  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .json({ error: error.message || "Internal server error" });
  }
};
