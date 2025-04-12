"use client";

import PageHeader from "@/components/layout/page-header";
import RecipesGrid from "@/components/pages/recipes/recipes-grid";
import { useRouter } from "next/navigation";
import React from "react";

export default function RecipesPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Retseptid"
        description="Siin saad hallata retsepte"
        onClickText="Lisa uus"
        onClick={() => router.push("/recipes/create")}
      />
      <RecipesGrid />
    </>
  );
}
