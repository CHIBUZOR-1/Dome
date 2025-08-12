// Backend/UserService/src/index.ts
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './db';
import path from 'path';
import cartModel from './cartModel';
import { connectRabbitMQ } from '@shared/rabbitmq';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

// Connect to RabbitMQ
connectRabbitMQ(process.env.RMQ3!)
  .then(async channel => {
    await channel.assertExchange("user_exchange", "topic", { durable: true });
    await channel.assertExchange("cart_dlx", "fanout", { durable: true }); // DLX for failures

    // Main queue with DLX
    await channel.assertQueue("cart_user_created_queue", {
      durable: true,
      deadLetterExchange: "cart_dlx",
      messageTtl: 10000 // 10s before retry
    });

    // Retry queue
    await channel.assertQueue("cart_retry_queue", {
      durable: true,
      deadLetterExchange: "user_exchange",
      messageTtl: 10000 // delay before re-delivery
    });

    channel.consume("cart_user_created_queue", async msg => {
      if (!msg) return;

      try {
        const { userId } = JSON.parse(msg.content.toString());
        console.log("📩 Received user.created event for", userId);

        await cartModel.create({ userId, items: {} });

        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to create cart, retrying...", err);

        // Retry by sending to retry queue
        channel.sendToQueue("cart_retry_queue", msg.content, { persistent: true });
        channel.ack(msg);
      }
    });
  })
  .catch(err => console.error("RabbitMQ error in CartService", err));

const PORT = process.env.HOSTPORT3;
// Start server only if DB is connected
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
})();