import mongoose from "mongoose"
mongoose.connect(process.env.DB!)

import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse as res } from "next/server";


export const POST = async(req: NextRequest)=>{
    try {
        const body = await req.json()
        const email = body.email
        const password = body.password
        const provider = body.provider

        if (Array.isArray(email)) {
            return res.json(
                { message: "Only one email allowed per login" },
                { status: 400 }
            );
        }

        
        const user =  await UserModel.findOne({email})
        
        const payload = {
            id: user._id,
            name: user.fullname,
            email: user.email,
        }

        if(!user) {
            return res.json({message: "user not found"},{status: 404})
        }
        
        if(provider === "google") {
            return res.json(payload)
        }


        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect){
            return res.json({message: "Invalid credentials"},{status: 401})
        }


        return res.json(payload)
    } 
    catch (error) {
        return serverCatchError(error)
    }
}