const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import IdInterface from "@/interfaces/id.interface";
import serverCatchError from "@/lib/server-catch-error";
import OrderModel from "@/models/order.model";
import { NextRequest, NextResponse as res } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

//Upadte staus of order
export const PUT = async(req: NextRequest, context: IdInterface)=>{
    try {
        const { id } = await context.params
        const orderId = id
        const body = await req.json()
        const status = body.status
        const session = await getServerSession(authOptions)

        //protected api 
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


        if(!status) {
            return res.json(
                { error: "Status not given" },
                { status: 404 }
            )
        }
        
        if(!orderId) {
            return res.json(
                { error: "OrderId not given" },
                { status: 404 }
            )
        }

        const order = await OrderModel.findById(orderId)

        if(!order) {
            return res.json(
                { error: "order not found.!" },
                { status: 404 }
            )
        }

        const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, {status: status}, {new: true})
        return res.json(updatedOrder)

    } 
    catch (error) {
        serverCatchError(error)    
    }
}