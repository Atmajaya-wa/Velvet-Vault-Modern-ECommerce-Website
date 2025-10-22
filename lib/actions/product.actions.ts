// 'use server'

// import { PrismaClient } from "@prisma/client"
// import { convertToPlainObject } from "../utils"
// import { LATEST_PRODUCTS_LIMIT } from "../constants"
// import { prisma } from "@/db/prisma"


// // Get Latest Products
// export async function gateLatestProducts() {
//     // const prisma = new PrismaClient()


//     const data = await prisma.product.findMany({
//         take: LATEST_PRODUCTS_LIMIT,
//         orderBy:{
//             createdAt:'desc'
//         }
//     })

//     return convertToPlainObject(data)
// }


'use server';

import { prisma } from '@/db/prisma';
import type { Product } from '@/types';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { convertToPlainObject, toPlainNumber } from '../utils';

/** Latest products */
export async function gateLatestProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  const data: Product[] = rows.map((p) => ({
    ...p,
    price: toPlainNumber(p.price),
    rating: toPlainNumber(p.rating),
  }));

  return convertToPlainObject(data);
}

/** Single product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findFirst({ where: { slug } });
  if (!p) return null;

  const normalized: Product = {
    ...p,
    price: toPlainNumber(p.price),
    rating: toPlainNumber(p.rating),
  };

  return convertToPlainObject(normalized);
}
