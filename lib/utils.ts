import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
