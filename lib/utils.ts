import * as z from "zod";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateShortId() {
  return Math.random().toString(36).slice(2, 8);
}
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;

export const clipSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, { message: "Content cannot be empty" })
      .max(5000, { message: "Content must be less than 5000 characters" }),
    type: z.enum(["text", "image", "link"]).describe("Please select a clip type"),
    isFavorite: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.type === "link") {
      const urlValidation = z.string().url({ message: "Content must be a valid URL when type is link" });
      
      const result = urlValidation.safeParse(data.content);
      
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error?.issues?.[0]?.message ?? "Content must be a valid URL when type is link", // Use the specific URL error message
          path: ["content"], 
        });
      }
    }
  });

export function isLink(text:string) {
  return urlRegex.test(text.trim());
}