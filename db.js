import { Sequelize } from "sequelize";
import doctor from './models/Doctor.js';
import patient from "./models/Patient.js";
import report from "./models/Report.js";
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
const ReportModel=report(sequelize);

PatientModel.hasMany(ReportModel, { foreignKey: 'patient_id' });
ReportModel.belongsTo(PatientModel, { foreignKey: 'patient_id' });


export default sequelize;
export {DoctorModel,PatientModel,ReportModel };
