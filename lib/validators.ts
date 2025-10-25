// import {z} from 'zod';
// import { formatNumberWithDecimal } from './utils';


// // Schema for inserting a new product

// const currency=z
//   .string()
//   .refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
//   'Price must be a valid number with up to 2 decimal places')

// export const insertProductSchema = z.object({
//   name: z.string().min(3,'Name must be at least 3 characters long'),
//   slug: z.string().min(3,'Slug must be at least 3 characters long'),
//   category: z.string().min(3,'Category must be at least 3 characters long'),
//   brand: z.string().min(3,'Brand must be at least 3 characters long'),
//   description: z.string().min(3,'Description must be at least 3 characters long'),
//   stock : z.coerce.number(),
//   images: z.array(z.string()).min(1,'At least 1 image is required'),
//   isFeatured: z.boolean(),
//   banner: z.string().nullable(),
//   price: currency,
// });

// lib/validators.ts
import { z } from 'zod'

export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long'),
  category: z.string().min(3, 'Category must be at least 3 characters long'),
  brand: z.string().min(3, 'Brand must be at least 3 characters long'),
  description: z.string().min(3, 'Description must be at least 3 characters long'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'At least 1 image is required'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: z.coerce.number().nonnegative(),  // ✅ এখন number
})

// Shcema for signing users in

export const signInFormSchema=z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6,'Password must be at least 6 characters long'),
})


// Shcema for signing Up users in

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // error shows under confirmPassword
  });