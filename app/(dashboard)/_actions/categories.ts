"use server";

import prisma from "@/lib/prisma";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CreateCategory = async (form: CreateCategorySchemaType) => {
  // Validate the incoming form data
  const parseBody = CreateCategorySchema.safeParse(form);
  if (!parseBody.success) {
    // Throw an error with detailed validation issues
    throw new Error(
      `Validation Error: ${JSON.stringify(parseBody.error.issues)}`
    );
  }

  // Ensure the user is authenticated
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Destructure validated data
  const { name, icon, type } = parseBody.data;

  try {
    // Create the new category in the database
    return await prisma.category.create({
      data: {
        userId: user.id,
        name,
        icon,
        type,
      },
    });
  } catch (error) {
    // Log and throw database operation errors
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

export default CreateCategory;
