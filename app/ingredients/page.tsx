"use client";

import Table from "@/components/common/table";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import services from "@/service/services";
import { useRouter } from "next/navigation";
import React from "react";

export default function RecipesPage() {
  const ingredients = services.ingredientService.useGetAll().data;
  const router = useRouter();

  const tableHeaders = ["Nimi", "Kategooria", "Staatus", ""];
  const tableData = ingredients.map((ingredient) => ({
    name: ingredient.name,
    category: ingredient.category.name,
    status: (
      <Badge
        text={ingredient.isActive ? "Aktiivne" : "Mitteaktiivne"}
        color={ingredient.isActive ? "active" : undefined}
        dot
      />
    ),
    actions: [
      {
        text: "Muuda",
        data: ingredient.id,
        onClick: () => router.push(`/ingredients/${ingredient.id}`),
      },
    ],
  }));
  return (
    <>
      <PageHeader
        title="Toorained"
        description="Siin saad hallata tooraineid"
        onClick={() => router.push("/ingredients/create")}
      />
      <Table
        className="mt-8"
        headers={tableHeaders}
        rows={tableData}
        groupBy="parentUnit"
      />
    </>
  );
}
