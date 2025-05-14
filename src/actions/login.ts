"use server";

import * as z from "zod";
import { prisma } from "../../prisma/prisma";
import { signIn } from "@/auth";
import  AuthError  from 'next-auth';
import { LoginSchema } from "@/schema";


export const login = async (data: z.infer<typeof LoginSchema>) => {
  
    const validatedData = LoginSchema.parse(data);

    if (!validatedData) {
      return { error: "Invalid input data" };
    }

    const { email, password } = validatedData;

    const userExists = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userExists || !userExists.password || !userExists.email) {
      return { error: "Kullanıcı bilgileri hatalı girildi" };
    }

    try {
      await signIn('credentials', {
        email: userExists.email,
        password: password,
        redirectTo: "/dashboard", // redirectTo yerine redirect kullanın
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials" };
          default:
            return {
              error: "Please confirm your email address"
            }
        }
      }
      throw error;
    }

    return {success: "User logged in succesfully"};
  };


