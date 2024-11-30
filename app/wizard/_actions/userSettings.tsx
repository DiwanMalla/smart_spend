"use server";

import prisma from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
  // Parse the currency input using the schema
  const parseBody = UpdateUserCurrencySchema.safeParse({ currency });
  if (!parseBody.success) {
    throw parseBody.error;
  }

  // Fetch the current user
  const user = await currentUser();
  if (!user) {
    // Redirect to sign-in if no user is found
    redirect("/sign-in");
    return; // Ensure no further code executes after redirect
  }

  // Try to find existing user settings
  const existingUserSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  if (!existingUserSettings) {
    // If no user settings are found, create a new record
    const userSettings = await prisma.userSettings.create({
      data: { userId: user.id, currency },
    });

    return { userId: user.id, currency: userSettings.currency };
  }

  // If user settings exist, update them
  const userSettings = await prisma.userSettings.update({
    where: { userId: user.id },
    data: { currency },
  });

  // Return the updated user settings
  return { userId: user.id, currency: userSettings.currency };
}
