import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { searchParams } = new URL(request.url);
  const paramsType = searchParams.get("type");

  // Validate the "type" query parameter
  const validator = z.enum(["expense", "income"]).nullable();
  const queryParams = validator.safeParse(paramsType);

  if (!queryParams.success) {
    return new Response(JSON.stringify(queryParams.error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const type = queryParams.data; // `type` will be `null` if not provided
  try {
    // Fetch categories based on the userId and type (if provided)
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
        ...(type && { type }),
      },
      orderBy: { name: "asc" },
    });

    // Return the categories as a JSON response
    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching categories:", error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while fetching categories",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
