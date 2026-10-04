import { Role, BookingStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import prisma from '../src/lib/prisma'

async function main() {
  console.log('Clearing database...')
  await prisma.transaction.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.bookingLocation.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.service.deleteMany()
  await prisma.helperProfile.deleteMany()
  await prisma.customerProfile.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding Services...')
  const services = await Promise.all([
    prisma.service.create({ data: { name: 'Grocery Shopping', description: 'We will buy and deliver your groceries.', basePrice: 150.00 } }),
    prisma.service.create({ data: { name: 'Moving Help', description: 'Help with lifting and moving heavy items.', basePrice: 400.00 } }),
    prisma.service.create({ data: { name: 'General Errands', description: 'Picking up dry cleaning, mail, etc.', basePrice: 200.00 } }),
    prisma.service.create({ data: { name: 'Queue Assistance', description: 'Standing in line for you.', basePrice: 100.00 } })
  ])

  console.log('Seeding Users...')
  const password = await bcrypt.hash('password123', 10)

  // 1. Customer
  const customer = await prisma.user.create({
    data: {
      name: 'Fahim Ahmed',
      email: 'customer@example.com',
      password,
      role: Role.CUSTOMER,
      customerProfile: { create: { phone: '01700000000', address: 'Banani, Dhaka' } }
    }
  })

  // 2. Helper
  const helper = await prisma.user.create({
    data: {
      name: 'Rahim Uddin',
      email: 'helper@example.com',
      password,
      role: Role.HELPER,
      helperProfile: { create: { phone: '01800000000', address: 'Mirpur, Dhaka', hourlyRate: 250, isOnline: true } }
    }
  })

  console.log('Seeding Bookings...')
  
  // Pending booking (Unassigned)
  await prisma.booking.create({
    data: {
      customerId: customer.id,
      serviceId: services[0].id,
      status: BookingStatus.SEARCHING,
      date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      estimatedPrice: services[0].basePrice,
      notes: 'Please pick up organic milk if possible.',
      location: { create: { address: 'Gulshan 2, Dhaka' } }
    }
  })

  // Accepted booking
  await prisma.booking.create({
    data: {
      customerId: customer.id,
      helperId: helper.id,
      serviceId: services[1].id,
      status: BookingStatus.ACCEPTED,
      date: new Date(Date.now() + 1000 * 60 * 60 * 48),
      estimatedPrice: services[1].basePrice,
      notes: 'We have a couch that needs to go to the 2nd floor.',
      location: { create: { address: 'Dhanmondi 27, Dhaka' } }
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
