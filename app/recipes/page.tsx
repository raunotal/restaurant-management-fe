"use client";

import PageHeader from "@/components/layout/page-header";
import { useRouter } from "next/navigation";
import React from "react";

export default function RecipesPage() {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="Retseptid"
        description="Siin saad hallata retsepte"
        onClick={() => router.push("/recipes/create")}
      />
    </>
  );
}
