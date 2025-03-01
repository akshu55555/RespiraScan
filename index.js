import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'

const app=express();

// Middleware
app.use(cookieParser());
app.use(express.json({strict:false}));
app.use(express.urlencoded({ extended: true }));
