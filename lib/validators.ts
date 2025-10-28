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
import { z } from "zod";

/** Shared */
const email = z.string().email("Enter a valid email address");
const password = z
  .string()
  .min(6, "Password must be at least 6 characters long");

/** Auth: Sign in */
export const signInFormSchema = z.object({
  email,
  password,
});

/** Auth: Sign up */
export const signUpFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((vals) => vals.password === vals.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

/** Money helper */
const money = z.coerce.number().nonnegative("Price must be a non-negative number");

/** Product */
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  brand: z.string().min(3, "Brand must be at least 3 characters long"),
  description: z.string().min(3, "Description must be at least 3 characters long"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "At least 1 image is required"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: money,
});

/** Cart item */
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Name must be given"),
  slug: z.string().min(1, "Slug must be given"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: money,
});

/** Cart */
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: money,
  shippingPrice: money,
  totalPrice: money,
  taxPrice: money,
  sessionCartId: z.string().min(1, "Session Cart ID is required"),
  userId: z.string().optional().nullable(),
});

// Shcema for shipping address

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters long"),
  streetAddress: z.string().min(3, "Street Address must be at least 3 characters long"),
  city: z.string().min(3, "City must be at least 3 characters long"),
  postalCode: z.string().min(3, "Postal Code must be at least 3 characters long"),
  country: z.string().min(3, "Country must be at least 3 characters long"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

