import { z } from "zod";

type UnitType = {
  id: string;
  name: string;
  displayName: string;
  ratio?: number;
  parentUnit?: UnitType | null;
};

type CreateUnitDTOType = Omit<Unit, "id" | "parentUnit"> & {
  parentUnitId?: string;
};

export const unitSchema: z.ZodType<UnitType> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().min(1, "Ühiku nimi ei tohi olla tühi"),
    displayName: z.string(),
    ratio: z.number().positive().optional(),
    parentUnit: z.union([unitSchema, z.null()]).optional(),
  })
);

export const createUnitSchema: z.ZodType<CreateUnitDTOType> = z.object({
  name: z.string().min(1, "Ühiku nimi ei tohi olla tühi"),
  displayName: z.string(),
  ratio: z.number().optional(),
  parentUnitId: z.string().optional(),
});

export type Unit = z.infer<typeof unitSchema>;
export type CreateUnitDTO = z.infer<typeof createUnitSchema>;
