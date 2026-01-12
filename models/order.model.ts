import mongoose, { Schema, model, models } from "mongoose";
import UserModel from "./user.models";
import ProductModel from "./product.model";

export interface OrderModelInterface extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  price: number;
  discount: number;
  status: "processing" | "dispatched" | "returned" | "delivered";
}

const orderSchema = new Schema<OrderModelInterface>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: UserModel, 
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: ProductModel,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "processing",
      enum: ["processing", "dispatched", "returned", "delivered"],
    },
  },
  { timestamps: true }
);

const OrderModel =
  models.Order || model<OrderModelInterface>("Order", orderSchema);

export default OrderModel;
