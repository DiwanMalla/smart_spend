import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01), // Ensures the amount is a positive number and a multiple of 0.01
  description: z.string().min(1, "Description is required"), // Ensures description is a non-empty string
  date: z.coerce.date(),
  category: z.string().min(1, "Category is required"), // Ensures category is a non-empty string
  type: z.enum(["income", "expense"], { message: "Invalid transaction type" }), // Ensures type is either 'income' or 'expense'
});
export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
