import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Chat Test...");
  
  // 1. Create a dummy Customer and Helper
  const customer = await prisma.user.create({
    data: {
      name: "Test Customer",
      email: `customer_${Date.now()}@test.com`,
      role: "CUSTOMER",
    }
  });
  
  const helper = await prisma.user.create({
    data: {
      name: "Test Helper",
      email: `helper_${Date.now()}@test.com`,
      role: "HELPER",
    }
  });

  // 2. Create a dummy Service
  const service = await prisma.service.create({
    data: {
      name: "Test Service",
      basePrice: 500,
    }
  });

  // 3. Create a Booking between them
  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      helperId: helper.id,
      serviceId: service.id,
      date: new Date(),
      estimatedPrice: 500,
      status: "ACCEPTED"
    }
  });
  
  console.log(`\nCreated Booking ID: ${booking.id}`);

  // 4. Simulate Customer sending a message to Helper
  console.log("\nSimulating Customer sending a message...");
  const msg1 = await prisma.message.create({
    data: {
      bookingId: booking.id,
      senderId: customer.id,
      receiverId: helper.id,
      content: "Hello! Are you on your way?"
    },
    include: { sender: { select: { name: true } } }
  });
  console.log(`[${msg1.sender.name}]: ${msg1.content}`);

  // 5. Simulate Helper replying
  console.log("\nSimulating Helper replying...");
  const msg2 = await prisma.message.create({
    data: {
      bookingId: booking.id,
      senderId: helper.id,
      receiverId: customer.id,
      content: "Yes, I will be there in 10 minutes!"
    },
    include: { sender: { select: { name: true } } }
  });
  console.log(`[${msg2.sender.name}]: ${msg2.content}`);

  // 6. Fetch the conversation exactly as the API would
  console.log("\nFetching conversation history...");
  const history = await prisma.message.findMany({
    where: { bookingId: booking.id },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { name: true, role: true } }
    }
  });
  
  console.log("--- CHAT HISTORY ---");
  history.forEach(msg => {
    console.log(`[${msg.sender.role} - ${msg.sender.name}]: ${msg.content}`);
  });
  
  // Cleanup test data
  console.log("\nCleaning up test data...");
  await prisma.booking.delete({ where: { id: booking.id } });
  await prisma.service.delete({ where: { id: service.id } });
  await prisma.user.deleteMany({ where: { id: { in: [customer.id, helper.id] } } });
  
  console.log("Test completed successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
