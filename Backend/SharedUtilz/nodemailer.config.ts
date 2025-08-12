// Backend/sharedUtilz/nodemailer-config.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  host: process.env.HOST,
  port: parseInt(process.env.PORTZ  || "587", 10), // Ensure port is a number
  secure: process.env.SECURE === 'true', // Convert to boolean
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});


const sender = process.env.EMAIL



export { transporter, sender }