// Backend/UserService/src/index.ts
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './db';

dotenv.config({ path: path.resolve(process.cwd(), 'ReviewService/.env') });

const app: Application = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

const PORT = process.env.HOSTPORT5;
// Start server only if DB is connected
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
})();