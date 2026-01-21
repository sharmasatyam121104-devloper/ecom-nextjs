import mongoose, { Schema, model, models } from "mongoose";
import UserModel from "./user.models";
import ProductModel from "./product.model";
import { generateOrderId } from "@/lib/generateOrderId";

export interface OrderModelInterface extends mongoose.Document {
  userOrderId: string
  userId: mongoose.Types.ObjectId;
  productIds : mongoose.Types.ObjectId[];
  prices: number[];
  discounts: number[];
  quantity: number[];
  grossTotal: number;
  status: "processing" | "dispatched" | "returned" | "delivered";
}

const orderSchema = new Schema<OrderModelInterface>(
  {
    userOrderId: {
      type: String,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: UserModel, 
      required: true,
    },
    productIds: [{
      type: mongoose.Types.ObjectId,
      ref: ProductModel,
      required: true,
    }],
    prices: [{
      type: Number,
      required: true,
    }],
    discounts: [{
      type: Number,
      required: true,
    }],
    quantity: [{
      type: Number,
      required: true,
    }],
    grossTotal: {
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

//  Auto-generate order id before save
orderSchema.pre("save", function () {
  if (!this.userOrderId) {
    this.userOrderId = generateOrderId();
  }
});

const OrderModel =
  models.Order || model<OrderModelInterface>("Order", orderSchema);

export default OrderModel;
