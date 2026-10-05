"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function acceptJobAction(requestId: string, userId: string) {
  try {
    await prisma.booking.update({
      where: { id: requestId },
      data: { helperId: userId, status: "ACCEPTED" }
    });
  } catch (error) {
    console.error("Error accepting job:", error);
    throw new Error("Failed to accept job");
  }

  revalidatePath("/helper/dashboard");
  redirect(`/helper/active-job/${requestId}`);
}
