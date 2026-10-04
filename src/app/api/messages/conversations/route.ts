import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isCustomer = session.user.role === 'CUSTOMER';
    
    // Find all active/completed bookings that have a helper assigned
    const bookings = await prisma.booking.findMany({
      where: {
        ...(isCustomer ? { customerId: session.user.id } : { helperId: session.user.id }),
        helperId: { not: null },
      },
      include: {
        customer: { select: { id: true, name: true, image: true } },
        helper: { select: { id: true, name: true, image: true } },
        service: { select: { name: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Transform bookings into conversations list
    const conversations = bookings.map(b => {
      const otherParty = isCustomer ? b.helper : b.customer;
      const lastMessage = b.messages[0];
      
      return {
        id: b.id, // We use bookingId as conversation ID
        name: otherParty?.name || "Unknown",
        image: otherParty?.image || `https://i.pravatar.cc/150?u=${otherParty?.id}`,
        service: b.service.name,
        lastMessage: lastMessage ? lastMessage.content : "No messages yet",
        time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "",
        unread: 0, // Unread count logic can be added later
        online: false // Real-time online status can be added later
      };
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("GET Conversations Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
