import 'dotenv/config';
import prisma from './src/lib/prisma'

const services = [
  { name: "Shopping Assistance", description: "Carry bags or assist while shopping in busy markets.", basePrice: 150 },
  { name: "Moving Help", description: "An extra pair of hands for lifting and moving items.", basePrice: 200 },
  { name: "Queue Assistance", description: "Wait in line for tickets, banking, or events.", basePrice: 100 },
  { name: "Errands", description: "Collect or submit documents and packages.", basePrice: 150 },
  { name: "Office Help", description: "Short-term help with filing, organizing, or simple office tasks.", basePrice: 180 },
  { name: "Event Assistance", description: "Help with setup, serving, or managing guests at small events.", basePrice: 200 },
  { name: "Elderly Assistance", description: "Everyday non-medical help for seniors.", basePrice: 250 },
  { name: "Custom Task", description: "Describe your own legal and safe short-term task.", basePrice: 150 }
];

async function main() {
  for (const s of services) {
    const existing = await prisma.service.findFirst({
      where: { name: s.name }
    });
    if (!existing) {
      await prisma.service.create({
        data: s
      });
      console.log(`Created ${s.name}`);
    } else {
      console.log(`${s.name} already exists`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
