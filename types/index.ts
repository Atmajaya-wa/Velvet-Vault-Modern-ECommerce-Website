// import { insertProductSchema } from '@/lib/validators';
// import {z} from 'zod';

// // Define the Product type based on the insertProductSchema

// export type Product = z.infer<typeof insertProductSchema> & {
//     id: string;
//     rating: number;
//     createdAt: Date;
    
// }

// types/index.ts
import { z } from 'zod'
import { insertProductSchema,insertCartSchema,cartItemSchema } from '@/lib/validators'

export type Product = z.infer<typeof insertProductSchema> & {
  id: string
  rating: number      // ✅ number
  numReviews: number
  createdAt: Date
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;