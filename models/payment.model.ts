import mongoose, { Schema, model, models } from "mongoose";
import OrderModel from "./order.model";
import UserModel from "./user.models";

export interface PaymentModelInterface extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  orderId: mongoose.Types.ObjectId
  paymentId: string
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
