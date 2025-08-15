// Backend/CartService/src/index.ts
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './db';
import path from 'path';
import cartModel from './cartModel';
import { connectRabbitMQ } from '@shared/rabbitmq';
import { EVENTS } from '@shared/events.config';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
// Map event handlers here (only in this file)
const HANDLERS: Record<string, (data: any) => Promise<void>> = {
  "user.created": async ({ userId }) => {
    console.log("📩 Received user.created for", userId);
    await cartModel.create({ userId, items: {} });
  },
  "user.deleted": async ({ userId }) => {
    console.log("📩 Received user.deleted for", userId);
    await cartModel.deleteOne({ userId });
  },
  "order.completed": async ({ orderId, userId }) => {
    console.log("📦 Order completed:", orderId, "→ clearing cart");
    if (!userId) {
      console.warn(`⚠️ No userId provided for order ${orderId}, cannot clear cart.`);
      return;
    }
    await cartModel.updateOne(
      { userId },
      { $set: { items: {} } } // or [] depending on your schema
    );
    console.log(`🛒 Cart cleared for user ${userId} after order ${orderId}`);
  }
};

// Connect to RabbitMQ

// Start server only if DB is connected
(async () => {
  await connectDB();
    connectRabbitMQ(process.env.RMQ3!)
    .then(async channel => {
      channel.prefetch(1);

      await channel.assertExchange("user_exchange", "topic", { durable: true });
      await channel.assertExchange("cart_dlx", "fanout", { durable: true });

      // Filter only cart service events
      const myEvents = EVENTS.filter(e => e.service === "cart");

      for (const event of myEvents) {
        await channel.assertQueue(event.queue, {
          durable: true,
          deadLetterExchange: "cart_dlx",
          messageTtl: 10000
        });
        await channel.bindQueue(event.queue, "user_exchange", event.key);

        await channel.assertQueue(event.retryQueue, {
          durable: true,
          deadLetterExchange: "user_exchange",
          deadLetterRoutingKey: event.key,
          messageTtl: 10000
        });

        channel.consume(event.queue, async msg => {
          if (!msg) return;
          try {
            const data = JSON.parse(msg.content.toString());
            await HANDLERS[event.key]?.(data);
            channel.ack(msg);
          } catch (err) {
            console.error(`❌ Failed to process ${event.key}`, err);
            channel.sendToQueue(event.retryQueue, msg.content, { persistent: true });
            channel.ack(msg);
          }
        });
      }
    })
    .catch(err => console.error("RabbitMQ error in CartService", err));
  const PORT = process.env.HOSTPORT3;
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
})();