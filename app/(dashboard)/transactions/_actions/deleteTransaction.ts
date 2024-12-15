"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteTransaction(id: string) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
    return; // Explicitly stop execution
  }

  // Fetch the transaction
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
  });
  if (!transaction) {
    throw new Error("Bad request: Transaction not found.");
  }

  // Extract and parse the transaction date
  const transactionDate = new Date(transaction.date);

  // Perform the deletion and history updates in a transaction
  await prisma.$transaction([
    // Delete the transaction
    prisma.transaction.delete({
      where: { id },
    }),

    // Update month history
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transactionDate.getUTCDate(),
          month: transactionDate.getUTCMonth(),
          year: transactionDate.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),

    // Update year history
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transactionDate.getUTCMonth(),
          year: transactionDate.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
