//initialize our database
import { Sequelize } from "sequelize";
import {doctor} from '../models/Doctor.js'
const { DB_HOST, DB_USER, DB_DB, DB_PASS } = process.env;

// Initialize Sequelize
const sequelize = new Sequelize(DB_DB, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false, // Set to false in production
});

// Initialize models
const DoctorModel = doctor(sequelize);

export default DoctorModel;