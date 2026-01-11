import mongoose, { Schema, model, models } from "mongoose";
import UserModel from "./user.models";
import ProductModel from "./product.model";

export interface OrderModelInterfce extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  price: number
  discount: number
  status: "processing" | "dispatched" | "returned" | "delivered"
}

const orderSchema = new Schema<OrderModelInterfce>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: UserModel,
        requred: true,
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: ProductModel,
        requred: true,
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "processing",
        enum: ["processing", "dispatched", "returned", "delivered"]
    }
},{timestamps: true})

const OrderModel = models.Order || model<OrderModelInterfce>("Order", orderSchema)

export default OrderModel