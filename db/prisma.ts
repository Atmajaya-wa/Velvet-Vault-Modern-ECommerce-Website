// import { Pool, neonConfig } from '@neondatabase/serverless';
// import { PrismaNeon } from '@prisma/adapter-neon';
// import { PrismaClient } from '@prisma/client';
// import ws from 'ws';

// // Sets up WebSocket connections, which enables Neon to use WebSocket communication.
// neonConfig.webSocketConstructor = ws;
// const connectionString = `${process.env.DATABASE_URL}`;

// // Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
// const pool = new Pool({ connectionString });

// // Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
// const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
// export const prisma = new PrismaClient ({ adapter }).$extends({
//   result: {
//     product: {
//       price: {
//         compute(product) {
//           return product.price.toString();
//         },
//       },
//       rating: {
//         compute(product) {
//           return product.rating.toString();
//         },
//       },
//     },
//   },
// });


// db/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Put it in .env and restart the dev server.')
}

// (যদি WebSocket দরকার হয়)
neonConfig.webSocketConstructor = ws
// neonConfig.poolQueryViaFetch = true // edge/fetch চ্যানেলের দরকার হলে

// ✅ Pool ছাড়াই সরাসরি connectionString দিন
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })

// dev হট-রিলোডে multiple client এড়াতে
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
