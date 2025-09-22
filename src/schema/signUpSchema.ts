import {z} from "zod";

export const usernameValidation = z
.string()
.min(2,"Username must be atleast 2 characters")
.max(20,"Must not be more than 20 characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special charaters")

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must have atleast 6 characters"})
})