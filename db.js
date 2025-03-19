//initialize our database
import { Sequelize } from "sequelize";
// import {doctor} from '../models/Doctor.js';
// import {patient} from '../models/Patient.js';

const { DB_HOST, DB_USER, DB_NAME } = process.env;

// Initialize Sequelize


  const sequelize = new Sequelize(DB_NAME, DB_USER, "forever4-5", {
    host: DB_HOST,
    dialect: 'postgres',
   
    logging: false, // Set to false in production
  });



export default sequelize;


// // Initialize models
// const DoctorModel = doctor(sequelize);
// const PatientModel= patient(sequelize);
// export {DoctorModel , PatientModel};

// module