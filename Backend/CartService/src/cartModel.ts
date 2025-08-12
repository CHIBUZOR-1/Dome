// Backend/CartService/src/cartModel.ts
import mongoose, { Schema, InferSchemaType } from 'mongoose';

const cartSchema = new Schema(
    {
        userId: { type: String, required: true},
        items: { type: Object, default: {}}
    },
    { timestamps: true, minimize: false }
);

export type ICart = InferSchemaType<typeof cartSchema>;

const cartModel = mongoose.model<ICart>('carts', cartSchema);
export default cartModel;