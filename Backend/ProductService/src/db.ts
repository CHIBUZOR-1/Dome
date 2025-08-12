// Backend/ProductService/src/db.ts
import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL2 as string);
    console.log('✅ Connected to Database');
  } catch (error) {
    console.error('❌ Connection Error:', (error as Error).message);
    process.exit(1); // Optional: exit process on failure
  }
}