import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            // behind the scene it makes a html form
            credentials: {
                email: { label: "email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier},
                        ]
                    })
                    if(!user){
                        throw new Error("No user found by this email")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account first")
                    }
                    const isPaswordCorrect = await bcrypt.compare(credentials.password,user.password)
                    if(isPaswordCorrect){
                        return user
                    }else throw new Error("Incorrect password")
                } catch (error:any) {
                    throw new Error
                }
            }
        })
    ],
    pages:{
        signIn:'/sign-in'
    },
    session:{strategy:"jwt"},
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user._id=token._id,
                session.user.isAcceptingMessages = token.isAcceptingMessages,
                session.user.isVerified = token.isVerified,
                session.user.username = token.username
            }
      return session
    },
    async jwt({ token, user }) {
        if(user){
            token._id = user._id?.toString(),
            token.isVerified = user.isVerified,
            token.isAcceptingMessages = user.isAcceptingMessages,
            token.username = user.username
        }
      return token
    }
    }
    
}