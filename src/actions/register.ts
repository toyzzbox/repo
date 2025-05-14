"use server"


import * as z from "zod"
import {prisma} from "../../prisma/prisma";
import bcrypt from "bcryptjs";
import { RegisterSchema} from "../../schema";



export const register = async (data: z.infer<typeof RegisterSchema>) => {
    try {
        const validatedData = RegisterSchema.parse(data);
    
        if(!validatedData) {
            return {error: "Invalid input data"}
        }

        const {email, name, password, passwordConfirmation} = validatedData ;

        if (password !== passwordConfirmation) {
            return {error: "Password dont match"}
        }

        const hashedPassword = await bcrypt.hash(password, 10);
    


        const userExist = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if(userExist) {
            return {error: "user already exists"}
        }


        const lowerCaseEmail = email.toLowerCase();

        const user = await prisma.user.create({
            data: {
                email: lowerCaseEmail,
                password: hashedPassword,
                name,
            }
        })

        return {success: "user created successfully"}
} catch (error) {
console.error(error);
return {error: "An error occured"}
}}