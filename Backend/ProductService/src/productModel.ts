import mongoose, { Schema, InferSchemaType } from 'mongoose';

const productSchema = new Schema({
    name: { type: String, required: true},
    brand: {type: String, required: true},
    description: { type: String, required: true},
    images: [],
    imageIdz: [],
    category: {type: String},
    subCategory: {type: String},
    newArrival: { type: Boolean, default: false},
    newPrice: {type: String},
    oldPrice: {type: String},
    stock: { type: String },
    totalRatings: { type: String},
    numReviews: {type: String},
}, {
    timestamps: true,
    minimize: false
});

export  type Iproduct = InferSchemaType<typeof productSchema>;
const productModel = mongoose.model<Iproduct>('carts', productSchema);
export default productModel;