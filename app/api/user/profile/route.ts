const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.models";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";


//Upadte address
export const PUT = async(req: NextRequest)=>{
    try {
        // protected api 
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
        const mobile = body.mobile
        const street = body.street   
        const area = body.area
        const city = body.city
        const state = body.state
        const pincode = body.pincode

        if(!mobile) {
            return res.json(
                { error: "Mobile is required." },
                { status: 422 }
            )
        }

        if(!street) {
            return res.json(
                { error: "Street is required." },
                { status: 422 }
            )
        }

        if(!area) {
            return res.json(
                { error: "Area is required." },
                { status: 422 }
            )
        }

        if(!city) {
            return res.json(
                { error: "City is required." },
                { status: 422 }
            )
        }

        if(!state) {
            return res.json(
                { error: "State is required." },
                { status: 422 }
            )
        }

        if(!pincode) {
            return res.json(
                { error: "Pincode is required." },
                { status: 422 }
            )
        }

        await UserModel.findByIdAndUpdate(session.user.id,{address:{mobile, street, area, city, state, pincode}},{ new: true, runValidators: true })

        return res.json(  { message: 'Address updated', address: session.user.address },{ status: 200 })

    } catch (error) {
        return serverCatchError(error)
    }
}

//Get Profile address
export const GET = async()=>{
    try {
        // protected api 
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
    
        const address = await UserModel.findById(session.user.id).select("address")

        return res.json(address)

    } catch (error) {
        return serverCatchError(error)
    }   
}