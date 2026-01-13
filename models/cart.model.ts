import mongoose, { Schema, model, models } from "mongoose";
import UserModel from "./user.models";
import ProductModel from "./product.model";

export interface CartModelInterface extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  qauantity: number;
  discount: number;
  status: "processing" | "dispatched" | "returned" | "delivered";
}

const cartSchema = new Schema<CartModelInterface>(
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
    qauantity: {
        type: Number,
        default: 1
    },
  },
  { timestamps: true }
);

const CartModel = models.Cart || model<CartModelInterface>("Cart", cartSchema);

export default CartModel;
