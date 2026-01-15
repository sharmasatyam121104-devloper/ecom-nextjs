const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import IdInterface from "@/interfaces/id.interface";
import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import ProductModel from "@/models/product.model";
import CartModel from "@/models/cart.model";

//Upadte product quantity fromm cart 
export const PUT = async (req: NextRequest, context: IdInterface) => {
  try {
    const { id } = await context.params
    const productId = id
    const { quantity } = await req.json(); // +1 or -1

    const session = await getServerSession(authOptions);

    //  protected api
    if (!session || session.user.role !== "user") {
      return res.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (quantity !== 1 && quantity !== -1) {
      return res.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedCart = await CartModel.findOneAndUpdate(
      { userId: session.user.id, productId },
      { $inc: { qauantity: quantity } },
      { new: true }
    );

    //  quantity 0 ho gayi to delete
    if (updatedCart && updatedCart.qauantity <= 0) {
      await CartModel.findByIdAndDelete(updatedCart._id);
      return res.json({ message: "Item removed from cart" });
    }

    return res.json({
      success: true,
      data: updatedCart,
    });

  } catch (error) {
    return serverCatchError(error);
  }
};

//Delete product quantity fromm cart 
export const DELETE = async (req: NextRequest, context: IdInterface) => {
  try {
    const { id } = await context.params
    const productId = id

    const session = await getServerSession(authOptions);

    //  protected api
    if (!session || session.user.role !== "user") {
      return res.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json({ error: "Product not found" }, { status: 404 });
    }

    const deltedCart = await CartModel.findOneAndDelete({userId: session.user.id, productId})

    if(!deltedCart){
        return res.json(
            { error: "Item not found in cart" },
            { status: 404 }
        );
    }

    return Response.json({
        success: true,
        message: "Item removed from cart",
    });

  } 
  catch (error) {
    return serverCatchError(error);
  }
};