import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    return new Error(queryParams.error.message);
  }
  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );
  return Response.json(stats);
}
export type getCategoriesStatsResponseType = {
  type: TransactionType; // Ensure this matches the `TransactionType` enum or string values you use
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
