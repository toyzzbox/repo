"use server";

import { prisma } from "@/lib/prisma";



type CreateProductArgs = {
  name: string;
  description: string;
  price: number;

};


export async function createProduct(previousState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);


    const product = await prisma.product.create({
      data: {
 
        name,
        description,
        price,
  
      },
      
    });

    return "Product created successfully";
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    return "An error occurred: " + error.message;
  }
}
