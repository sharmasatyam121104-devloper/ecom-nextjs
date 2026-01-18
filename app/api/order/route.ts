const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import ProductModel from "@/models/product.model";
import OrderModel from "@/models/order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


//Creat a order by user only
export const POST = async(req: NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user.id
        const body =  await req.json()
        const productId = body.productId

        //protected api 
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

        const product = await ProductModel.findById(productId).select("price discount")

        //If product not found
        if(!product) {
            return res.json(
                { error: "Product not found" },
                { status: 404 }
            )
        }

        const price = product.price
        const discount = product.discount

        const payload = {
            userId: userId,
            productId: productId,
            price: price,
            discount: discount,
        }

        const order = await OrderModel.create(payload)
        return res.json(order)
        
    } 
    catch (error) {
        serverCatchError(error)    
    }
}

//Fetch Orders for admin and user 
export const GET = async()=>{
    try {
        const session = await getServerSession(authOptions)

        //protected api 
        if(!session) {
            return res.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        let order = []
        const role = session.user.role

        if(role === "user") {
            order = await OrderModel.find({ userId: session.user.id }).sort({createdAt: -1})
            .populate({
                path: "productIds",
                select: "title image",
            })

        }

        if(role === "admin") {
            order = await OrderModel.find().sort({createdAt: -1})
            .populate("userId","fullname email mobile")
            .populate("productId")
        }

        return res.json(order)
        
    } 
    catch (error) {
        return serverCatchError(error)    
    }
}