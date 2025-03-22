import { Sequelize } from "sequelize";
import doctor from './models/Doctor.js';
import patient from "./models/Patient.js";

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

// Initialize Sequelize
const sequelize = new Sequelize("respira", "postgres", "forever4-5", {
  host: DB_HOST,
  dialect: "postgres",
  logging: false,
});

// Initialize models
const DoctorModel = doctor(sequelize);
const PatientModel = patient(sequelize);
export default sequelize;
export {DoctorModel,PatientModel };
