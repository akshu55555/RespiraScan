import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
const app=express();
import sequelize from "./db.js"; 
// import login from "./controllers/logincontroller.js";
import signup from "./controllers/signupcontrollerd.js";
import signup2 from "./controllers/signupcontrollerp.js";
import logindoc from "./controllers/logincontrollerd.js";
import loginpatient from './controllers/logincontrollerp.js';
import uploadMiddleware from './controllers/uploadcontroller.js';
import multer from 'multer';

// Middleware
app.use(cookieParser());
app.use(express.json({strict:false}));
app.use(express.urlencoded({ extended: true }));
const PORT=5003;
dotenv.config(); 


console.log(process.env.DB_USER);
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully!");
    app.listen(PORT, () => {
      console.log("You have reached respirascan server! Happy health!");
    });
  })
  .catch((err) => {
    console.error(" Database connection failed:", err);
  });

app.get('/',(req,res)=>{
    return res.status(200).json("HELLO");
})
app.use('/signupdoctor',signup);
app.use('/signuppatient',signup2);
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});
app.use('/logindoc',logindoc);
app.use('/loginpatient',loginpatient);
const upload = multer({ dest: 'uploads/' });

app.post('/upload', uploadMiddleware);