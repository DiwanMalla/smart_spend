import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    // Return a response with a redirect
    return Response.redirect("/sign-in", 302);
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    // Return a JSON response with an error message
    return new Response(JSON.stringify({ error: queryParams.error.message }), {
      status: 400, // Bad request
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const stats = await getCategoriesStats(
      user.id,
      queryParams.data.from,
      queryParams.data.to
    );
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Return a server error response in case of failure
    return new Response(
      JSON.stringify({ error: "An error occurred while fetching stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export type getCategoriesStatsResponseType = {
  type: TransactionType;
  category: string;
  categoryIcon: string;
  _sum: {
    amount: number | null;
  };
}[];

async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: { amount: true },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });
  return stats;
}
