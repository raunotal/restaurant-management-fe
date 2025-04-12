"use client";

import Table from "@/components/common/table";
import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import Icon from "@/components/ui/icons/icon";
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
        title: "Muuda",
        content: <Icon type="edit" size={16} />,
        data: ingredient.id,
        onClick: () => router.push(`/ingredients/${ingredient.id}`),
      },
      {
        title: "Kopeeri",
        content: <Icon type="duplicate" size={16} />,
        data: ingredient.id,
        onClick: () => router.push(`/ingredients/create?id=${ingredient.id}`),
      },
    ],
  }));
  return (
    <>
      <PageHeader
        title="Toorained"
        description="Siin saad hallata tooraineid"
        onClickText="Lisa uus"
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
