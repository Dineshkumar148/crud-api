import { Op } from "sequelize";
import Employee from "../models/employee.js";

// Create a new employee
export const createEmp = async (req, res) => {
  const { firstname, lastname, email, designation } = req.body;

  // Check for missing fields
  if (!firstname || !lastname || !designation) {
    return res
      .status(400)
      .json({ error: "All fields are required except email" });
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    if (email) {
      // Validate email format
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid hari email format" });
      }

      // Check if the email already exists, excluding null values
      const existingEmployee = await Employee.findOne({
        where: {
          email: {
            [Op.ne]: null,
            [Op.eq]: email,
          },
        },
      });
      if (existingEmployee) {
        return res
          .status(409)
          .json({ error: "Email already exists. Please try a different one." });
      }
    }

    console.log("Attempting to create employee with data:", req.body);
    const newEmployee = await Employee.create({
      firstname,
      lastname,
      email: email || null,
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

// Bulk upload employees
export const bulkCreateEmp = async (req, res) => {
  const { employees } = req.body;

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    const newEmployees = [];

    for (const employee of employees) {
      const { firstname, lastname, email, designation } = employee;

      // Check for missing fields
      if (!firstname || !lastname || !designation) {
        return res
          .status(400)
          .json({ error: "All fields are required except email" });
      }

      if (email) {
        // Validate email format
        if (!emailRegex.test(email)) {
          return res
            .status(400)
            .json({
              error: `Invalid email format for ${firstname} ${lastname}`,
            });
        }

        // Check if the email already exists, excluding null values
        const existingEmployee = await Employee.findOne({
          where: {
            email: {
              [Op.ne]: null,
              [Op.eq]: email,
            },
          },
        });
        if (existingEmployee) {
          return res
            .status(409)
            .json({
              error: `Email already exists for ${firstname} ${lastname}. Please try a different one.`,
            });
        }
      }

      newEmployees.push({
        firstname,
        lastname,
        email: email || null,
        designation,
      });
    }

    console.log("Attempting to create employees with data:", newEmployees);
    const createdEmployees = await Employee.bulkCreate(newEmployees);
    res.status(201).json(createdEmployees);
  } catch (error) {
    console.error("Error creating employees:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};

// Get all employees in alphabetical order by id
export const getAllEmp = async (req, res) => {
  try {
    const { skip = 0, take = 10, searchTerm, ...filter } = req.query;
    const pagination = { offset: Number(skip), limit: Number(take) };
    const filters = filter || {};

    if (searchTerm) {
      filters[Op.or] = [
        { firstname: { [Op.iLike]: `%${searchTerm}%` } },
        { lastname: { [Op.iLike]: `%${searchTerm}%` } },
        { email: { [Op.iLike]: `%${searchTerm}%` } },
        { designation: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    // Sorting by id in alphabetical order
    const order = [["id", "ASC"]];
    const whereCondition = filters[Op.or]
      ? { [Op.and]: [filters, {}] }
      : { ...filters };

    const [count, employees] = await Promise.all([
      Employee.count({ where: whereCondition }),
      Employee.findAll({
        attributes: ["id", "firstname", "lastname", "email", "designation"],
        where: whereCondition,
        ...pagination,
        order,
      }),
    ]);

    res.json({ count, employees });
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
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
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

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    const employee = await Employee.findOne({ where: { id } });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    if (email) {
      // Validate email format
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Check if the email already exists, excluding the current employee
      const existingEmployee = await Employee.findOne({
        where: {
          email,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (existingEmployee) {
        return res
          .status(409)
          .json({ error: "Email already exists. Please try a different one." });
      }
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
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
};
