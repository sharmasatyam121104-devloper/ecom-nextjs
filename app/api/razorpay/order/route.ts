const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import Razorpay from "razorpay";
import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

export const POST = async(req: NextRequest)=>{
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
        const payload = {
            amount: Number(body.amount)*100,
            currency: "INR",
        }

        const order  = await rzp.orders.create(payload)
        return res.json(order)
    } 
    catch (error) {
        return serverCatchError(error)
    }
}