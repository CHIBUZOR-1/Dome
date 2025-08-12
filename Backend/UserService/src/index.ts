// Backend/UserService/src/index.ts
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './db';
import userRouter from './userRoutes';
import path from 'path';
import { connectRabbitMQ } from '@shared/rabbitmq';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

// Connect to RabbitMQ
connectRabbitMQ(process.env.RMQ1!)
  .then(channel => {
    // Make sure the exchange exists
    channel.assertExchange("user_exchange", "topic", { durable: true });
  })
  .catch(err => {
    console.error("RabbitMQ connection failed", err);
  });

const PORT = process.env.HOSTPORT1;
// Start server only if DB is connected
app.use('/u', userRouter);
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
})();