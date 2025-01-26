import { z } from "zod";

type UnitType = {
  id: string;
  name: string;
  displayName?: string;
  ratio?: number;
  parentUnit?: UnitType | null;
};

const UnitSchema: z.ZodType<UnitType> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().min(1, "Ühiku nimi ei tohi olla tühi"),
    displayName: z.string().optional(),
    ratio: z.number().optional(),
    parentUnit: z.union([UnitSchema, z.null()]).optional(),
  })
);

export type Unit = z.infer<typeof UnitSchema>;
