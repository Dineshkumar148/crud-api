import { DataTypes } from "sequelize";
import { sequelize } from "../postgress/postgress.js";

const Employee = sequelize.define(
  "employee",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "employee",
    timestamps: false,
  }
);

export default Employee;
