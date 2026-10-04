import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20 // limit to recent 20
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET Notifications Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Mark a single or all notifications as read
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();

    if (id === "all") {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true }
      });
    } else if (id) {
      await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH Notifications Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
