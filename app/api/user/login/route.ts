import mongoose from "mongoose"
mongoose.connect(process.env.DB!)

import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse as res } from "next/server";


export const POST = async(req: NextRequest)=>{
    try {
        const {email, password} = await req.json()

        if (Array.isArray(email)) {
            return res.json(
                { message: "Only one email allowed per login" },
                { status: 400 }
            );
        }

        const user =  await UserModel.findOne({email})

        if(!user) {
            return res.json({message: "user not found"},{status: 404})
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect){
            return res.json({message: "Invalid credentials"},{status: 401})
        }

        const payload = {
            id: user._id,
            name: user.fullname,
            email: user.email,
        }

        return res.json(payload)
    } 
    catch (error) {
        return serverCatchError(error)
    }
}