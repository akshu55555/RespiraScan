import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
const app=express();
import sequelize from "./db.js"; // Import database connection

// Middleware
app.use(cookieParser());
app.use(express.json({strict:false}));
app.use(express.urlencoded({ extended: true }));

dotenv.config(); 

const PORT=5002;

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
