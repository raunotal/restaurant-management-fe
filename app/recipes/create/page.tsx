"use client";

import PageHeader from "@/components/layout/page-header";
import AddRecipeRow from "@/components/pages/recipes/add-recipe-row";
import TimeInput from "@/components/pages/recipes/time-input";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import Input from "@/components/ui/input";
import Switch from "@/components/ui/switch";
import services from "@/service/services";
import { CreateRecipeDTO } from "@/types/recipe";
import { setEmptyToNull } from "@/utils/helpers";
import { useForm } from "@tanstack/react-form";

export default function CreateRecipePage() {
  const recipeCategories = services.recipeCategoryService.useGetAll().data;

  const { mutateAsync: createMutateAsync } = services.recipeService.useCreate();

  const { handleSubmit, Field, Subscribe } = useForm({
    defaultValues: {
      name: "",
      isActive: false,
      categoryId: "",
      preparationTime: 0,
    } as CreateRecipeDTO,
    onSubmit: ({ value }) => createMutateAsync(setEmptyToNull(value)),
  });

  const recipeCategoriesData = recipeCategories.map((category) => ({
    key: category.id,
    value: category.name,
  }));

  const uploadImage = async (data: FormData) => {
    const response = await fetch("/api/images", {
      method: "POST",
      body: data,
    });
    console.log("response", await response.json());
  };

  return (
    <>
      <PageHeader title="Lisa uus retsept" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex gap-10 mt-10">
          <div className="basis-3/4">
            <div className="flex items-center gap-3 col-span-2">
              <Badge text="Mitteaktiivne" />
              <Field
                name="isActive"
                children={(field) => (
                  <Switch
                    checked={field.state.value}
                    onChange={(checked) => field.handleChange(checked)}
                  />
                )}
              />
              <Badge text="Aktiivne" color="active" />
            </div>
            <AddRecipeRow
              title="Retsepti nimetus, kategooria valik ja valmistusaeg"
              contentClassName="flex-col"
            >
              <div className="flex gap-4">
                {/* <Input name="name" isField={false} className="basis-2/3" /> */}
                <Field
                  name="name"
                  children={(field) => (
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isField={false}
                      className="basis-2/3"
                    />
                  )}
                />
                <Field
                  name="categoryId"
                  children={(field) => (
                    <Combobox
                      data={recipeCategoriesData}
                      onChange={(value) => field.handleChange(value?.key)}
                      isField={false}
                    />
                  )}
                />
              </div>
              <div>
                <Field
                  name="preparationTime"
                  children={(field) => (
                    <TimeInput
                      timeInMinutes={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                />
              </div>
            </AddRecipeRow>
          </div>
          <div className="basis-1/4">
            {/* image upload */}
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage(new FormData(e.target.form!))}
            />
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <Subscribe children={() => <Button type="submit">Salvesta</Button>} />
        </div>
      </form>
    </>
  );
}
