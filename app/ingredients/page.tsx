"use client";

import PageHeader from "@/components/layout/page-header";
import IngredientsGrid from "@/components/pages/ingredients/ingredients-grid";
import { useRouter } from "next/navigation";
import React from "react";

export default function RecipesPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Toorained"
        description="Siin saad hallata tooraineid"
        onClick={() => router.push("/ingredients/create")}
      />
      <IngredientsGrid />
    </>
  );
}
