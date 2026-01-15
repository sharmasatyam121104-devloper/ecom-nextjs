const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import { getServerSession } from "next-auth";
import { NextResponse as res, NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import ProductModel from "@/models/product.model";
import CartModel from "@/models/cart.model";
import serverCatchError from "@/lib/server-catch-error";

//Add product to cart
export const POST = async (req: NextRequest) => {
  try {
    //Protected API
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.json(
        { error: "Unauthorized!" },
        { status: 401 }
      );
    }

    if (session.user.role !== "user") {
      return res.json(
        { error: "Unauthorized, You are not a user" },
        { status: 401 }
      );
    }

    // Get body
    const body = await req.json();
    const userId = session.user.id;
    const productId = body.productId;

    if (!productId) {
      return res.json(
        { error: "Please provide product id." },
        { status: 400 }
      );
    }

    //Check product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    // Update OR Create cart item (IMPORTANT PART)
    const cart = await CartModel.findOneAndUpdate(
      { userId, productId },          // find condition
      {
        $inc: { qauantity: 1 },        // quantity +1
        $setOnInsert: { userId, productId }
      },
      {
        new: true,    // updated document return kare
        upsert: true  // nahi mila to create kare
      }
    );

    //  Response
    return res.json(cart, { status: 200 });

  } catch (error) {
    return serverCatchError(error);
  }
};

//Fetch card details for user
export const GET = async (req: NextRequest)=>{
    try {
        //protected api 
        const session = await getServerSession(authOptions)
        if(!session) {
            return res.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        if(session.user.role !== "user") {
            return res.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        //If user wants only count of product in cart
        const {searchParams} = new URL(req.url)

        if(searchParams.get('count')) {
            const count = await CartModel.countDocuments({userId: session.user.id}) 
            return res.json(count)
        }

        const cart = await CartModel.find({userId: session.user.id})
        .sort({createdAt: -1})
        .populate('productId')

        
        return res.json(cart)

    }
    catch (error) {
        return   serverCatchError(error) 
    }
}