import { resend } from "@/lib/resend";
import VerificationEmail from "../../emailTemplates/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { userAgent } from "next/server";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymous reviews app | Verification code',
            react: VerificationEmail({username:username,otp:verifyCode})
        });
        return {success:true,message:"Successfully sent verification email"}
    } catch (emailError) {
        console.error("Error sending verification email ",emailError)
        return {success:false,message:"Failed to send verification email"}
    }
}
