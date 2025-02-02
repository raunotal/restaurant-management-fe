"use client";

import PageHeader from "@/components/layout/page-header";
import AddRecipeRow from "@/components/pages/recipes/add-recipe-row";
import Badge from "@/components/ui/badge";
import Combobox from "@/components/ui/combobox";
import Input from "@/components/ui/input";
import Switch from "@/components/ui/switch";
import React from "react";

export default function CreateRecipePage() {
  return (
    <>
      <PageHeader title="Lisa uus retsept" />
      <div className="flex gap-10 mt-10">
        <div className="basis-2/3">
          <div className="flex items-center gap-3 col-span-2">
            <Badge text="Mitteaktiivne" />
            <Switch />
            <Badge text="Aktiivne" color="active" />
          </div>
          <AddRecipeRow title="Retsepti nimetus, kategooria valik ja valmistusaeg">
            <Input name="name" isField={false} className="basis-2/3" />
            <Combobox
              data={[]}
              onChange={() => console.log("change")}
              isField={false}
            />
          </AddRecipeRow>
          <AddRecipeRow>
            <div>
              <label htmlFor="description">Kirjeldus</label>
              <textarea id="description" name="description" className="input" />
            </div>
          </AddRecipeRow>
        </div>
        <div className="basis-1/3">
          <div>Add image and comments placeholder</div>
        </div>
      </div>
    </>
  );
}
