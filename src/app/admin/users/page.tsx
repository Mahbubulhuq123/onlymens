import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { UsersClient } from "./UsersClient";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    include: {
      customerProfile: true,
      helperProfile: true,
      _count: {
        select: {
          bookingsAsCustomer: true,
          bookingsAsHelper: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <UsersClient initialUsers={users} />;
}
