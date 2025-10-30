// import { PrismaClient } from '@prisma/client';
// import sampleData from './sample-data';

// async function main() {
//     const prisma = new PrismaClient();
//     await prisma.product.deleteMany();
//     await prisma.account.deleteMany();
//     await prisma.session.deleteMany();
//     await prisma.verificationToken.deleteMany();
//     await prisma.user.deleteMany();

//     await prisma.product.createMany({data:sampleData.products});
//     await prisma.user.createMany({data:sampleData.users});
   
//     console.log('Database has been seeded successfully.');
// }

// main(); 


// db/seed.ts
import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';

const prisma = new PrismaClient();

async function main() {
  // delete dependents first
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });

  console.log('Database has been seeded successfully.');
}

main().finally(() => prisma.$disconnect());
