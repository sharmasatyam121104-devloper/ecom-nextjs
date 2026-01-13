const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import serverCatchError from "@/lib/server-catch-error";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db)

import { NextResponse as res, NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import ProductModel from "@/models/product.model";
import CartModel from "@/models/cart.model";

//Add product to cart
export const POST = async (req: NextRequest)=>{
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

        const body = await req.json()
        body.user = session.user.id
        const userId = body.user
        const productId = body.productId
        const qauantity = body.qauantity

        if(!productId) {
            return res.json(
                { error: "Please provide product id." },
                { status: 401 }
            )
        }

        const product = await ProductModel.findById(productId)

        if(!product) {
            return res.json(
                { error: "Product nor found." },
                { status: 401 }
            )
        }

        // If user already add product and again same product hi want to add then we just increase quatoty by 1
        const updated = await CartModel.findOneAndUpdate({userId, productId}, {$inc: {qauantity: 1}})

        if(updated) {
           return res.json(updated) 
        }

        const cart = await CartModel.create({userId,productId, qauantity})
        
        return res.json(cart)

    }
    catch (error) {
        return   serverCatchError(error) 
    }
}
