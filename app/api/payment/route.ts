const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import serverCatchError from "@/lib/server-catch-error";
import PaymentModel from "@/models/payment.model";

//Create payment only by payments webhooks
export const POST = async (req:NextRequest)=>{
    try {
        const body = await req.json()
        const payment = await PaymentModel.create(body)
        return res.json(payment)
    } 
    catch (error) {
        return serverCatchError(error)    
    }
}

//Get all payments (only acess by admin)
export const GET = async ()=>{
    //protected api 
    const session = await getServerSession(authOptions)
    if(!session) {
        return res.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    if(session.user.role !== "admin") {
        return res.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }
    try {
        const payments = await PaymentModel.find()
        .populate("userId", "fullname email")
        .populate({
            path: 'orderId',
            populate: {
            path: 'productId',
            model: 'Product',
            },
        })


        return res.json(payments)
    } 
    catch (error) {
        return serverCatchError(error)    
    }
}