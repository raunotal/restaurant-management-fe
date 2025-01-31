import { z } from "zod";

export const recipeCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Kategooria nimi ei tohi olla tühi"),
});

export type RecipeCategory = z.infer<typeof recipeCategorySchema>;
