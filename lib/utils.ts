import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";

/** Tailwind + clsx merge */
export function cn(...inputs: ClassValue[]) {
  // clsx expects spread args, not an array
  return twMerge(clsx(...inputs));
}

/** Convert a Prisma object to a JSON-compatible plain object. */
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/** Format a number with exactly 2 decimal places */
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toFixed(2).split(".");
  return `${int}.${(decimal ?? "").padEnd(2, "0")}`;
}

/** Type guard for values that expose a Decimal-like toNumber() */
type HasToNumber = { toNumber: () => number };
function hasToNumber(v: unknown): v is HasToNumber {
  return (
    typeof v === "object" &&
    v !== null &&
    "toNumber" in (v as Record<string, unknown>) &&
    typeof (v as HasToNumber).toNumber === "function"
  );
}

/** Safely convert Prisma Decimal (or number-like) to number, with no `any` and no Prisma runtime import. */
export function toPlainNumber(value: unknown): number {
  return hasToNumber(value) ? value.toNumber() : Number(value);
}

// Format Error Message
// export async function formatError(error: any) {
//   if (error.name === "ZodError") {
//     const formatError = Object.keys(error.errors).map(
//       (field) => error.errors[field].message
//     );
//     return formatError.join('. ');
//   } 
//   else if (error.name === "PrismaClientKnownRequestError" &&
//     error.code === "P2002" ) 
//   {
//     const field = error.meta?.target ? error.meta.target[0] : 'Fields';
//     return `User with ${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
//   } 
//   else {
//     // Other error
//     return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
//   }
// }

export function formatError(error: unknown): string {
  // Zod
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (error && typeof error === "object" && (error as any).name === "ZodError") {
    const zod = error as ZodError;
    const messages = (zod.issues ?? []).map((i) => i.message);
    return messages.length ? messages.join(". ") : "Validation failed.";
  }

  // Prisma: unique constraint, etc.
  if (
    error &&
    typeof error === "object" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).name === "PrismaClientKnownRequestError" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).code === "P2002"
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fieldArr = (error as any).meta?.target as string[] | undefined;
    const field = fieldArr?.[0] ?? "field";
    const pretty = field.charAt(0).toUpperCase() + field.slice(1);
    return `User with ${pretty} already exists.`;
  }

  // Fallbacks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (error && typeof (error as any).message === "string") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error as any).message;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return JSON.stringify((error as any)?.message ?? error);
  } catch {
    return "Something went wrong.";
  }
}