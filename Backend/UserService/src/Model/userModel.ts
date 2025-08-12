// Backend/UserService/src/Model/userModel.ts
import mongoose, { Schema, InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false},
    phone: { type: String, unique: true },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationTokenExpiresAt: Date
  },
  { timestamps: true, minimize: false }
);

export type IUser = InferSchemaType<typeof userSchema>;

const UserModel = mongoose.model<IUser>('users', userSchema);
export default UserModel;
