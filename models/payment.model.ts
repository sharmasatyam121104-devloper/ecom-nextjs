import mongoose, { Schema, model, models } from "mongoose";
import OrderModel from "./order.model";
import UserModel from "./user.models";

export interface PaymentModelInterface extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  paymentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'processing';
  method: string;
  tax: number;
  fee: number;
  vendor: 'razorpay' | 'stripe'
}

const paymentSchema = new Schema<PaymentModelInterface>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: OrderModel,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    fee: {
      type: Number,
      default: 0
    },
    vendor: {
      type: String,
      default: 'razorpay',
      enum: ['razorpay', 'stripe'],
    },
  },
  { timestamps: true }
);

const PaymentModel = models.Payment || model<PaymentModelInterface>("Payment", paymentSchema);

export default PaymentModel;
