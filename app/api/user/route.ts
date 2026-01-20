const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.models";
import { getServerSession } from "next-auth";
import { NextResponse as res } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

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
    
        if(session.user.role !== "admin") {
            return res.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }
    
        const users = await UserModel.find({role: {$ne: "admin"}}).select("-password").sort({createdAt: -1})
        return res.json(users)

    } catch (error) {
        return serverCatchError(error)
    }
}

