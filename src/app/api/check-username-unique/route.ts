import dbConnect from "@/lib/dbConnect";
import {success, z} from "zod"
import UserModel from "@/model/User";
import { usernameValidation } from "@/schema/signUpSchema";


// query schema
const UsernameQuerySchema = z.object({
    username:usernameValidation
})

// check if username valid/available or not
// check if username exists or not

export async function GET(request:Request){
    await dbConnect()
    try {
        // extract query
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("qp res",result)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({success:false,message:usernameErrors?.length > 0 ? usernameErrors.join(', '): "Invalid query parameters"},{status:400})

        }

        const {username} = result.data
        const existingVerifiedUser = await UserModel.find({username,isVerified:true})
        if(existingVerifiedUser){
            return Response.json({success:false,message:"Username is already taken."},{status:400})
        }
        return Response.json({success:true,message:"Username is unique."},{status:400})

    } catch (error) {
        console.error("Error checking username",error)
        return Response.json({success:false,message:"Error checking username"},{status:500})
    }
}