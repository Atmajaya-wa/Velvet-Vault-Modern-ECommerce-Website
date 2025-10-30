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
import {insertOrderItemSchema,insertOrderSchema, insertProductSchema,insertCartSchema,cartItemSchema,shippingAddressSchema } from '@/lib/validators'

export type Product = z.infer<typeof insertProductSchema> & {
  id: string
  rating: number      // ✅ number
  numReviews: number
  createdAt: Date
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user:{
    name: string;
    email: string;
  };
};
