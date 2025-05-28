"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schema";
import { prisma } from "@/lib/prisma";

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedData = RegisterSchema.parse(data);

    const { email, name, password, passwordConfirmation } = validatedData;

    if (password !== passwordConfirmation) {
      return { error: "Passwords do not match" };
    }

    const lowerCaseEmail = email.toLowerCase();

    const userExist = await prisma.user.findFirst({
      where: {
        email: lowerCaseEmail,
      },
    });

    if (userExist) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        password: hashedPassword,
        name,
      },
    });

    return { success: "User created successfully" };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};
