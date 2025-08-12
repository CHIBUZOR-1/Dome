// Backend/UserService/src/index.ts
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import cloudinary from 'cloudinary';
import { connectDB } from './db';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

const PORT = process.env.HOSTPORT2;
// Start server only if DB is connected
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
})();