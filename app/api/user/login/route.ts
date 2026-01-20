const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db)

import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.models";
import { NextRequest, NextResponse as res } from "next/server";


export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { email, password, provider } = body

    if (Array.isArray(email)) {
      return res.json(
        { message: "Only one email allowed per login" },
        { status: 400 }
      )
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
      return res.json({ message: "User not found" }, { status: 404 })
    }

    const payload = {
      id: user._id.toString(),
      name: user.fullname,
      email: user.email,
      role: user.role || "user" ,  
      address: user.address
    }

    // Google login (no password check)
    if (provider === "google") {
      return res.json(payload)
    }

    //  Credentials login
    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
      return res.json({ message: "Invalid credentials" }, { status: 401 })
    }

    return res.json(payload)

  } catch (error) {
    return serverCatchError(error)
  }
}
