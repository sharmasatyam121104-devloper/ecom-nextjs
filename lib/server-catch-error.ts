import { NextResponse as res } from "next/server"

const serverCatchError = (error: unknown, status: number = 500)=>{

    if(error instanceof Error) {
        return res.json({message: error.message},{status})
    }

    return res.json({message: "Internal server errror"}, {status})
}

export default serverCatchError