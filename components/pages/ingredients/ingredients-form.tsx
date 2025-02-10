"use client";

import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import services from "@/service/services";
import {
  CreateIngredientDTO,
  createIngredientSchema,
} from "@/types/ingredient";
import { setEmptyToNull } from "@/utils/helpers";
import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import Switch from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import IngredientDeleteModal from "./ingredient-delete-modal";
import { Ingredient } from "@/types/ingredient";
import FormRow from "@/components/common/form-row";
import ImageUpload from "@/components/common/image-upload";

type IngredientFormProps = {
  ingredient?: Ingredient;
};

export default function IngredientFrom(props: IngredientFormProps) {
  const { ingredient } = props;
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const ingredientCategories =
    services.ingredientCategoryService.useGetAll().data;

  const { mutateAsync: createMutateAsync } =
    services.ingredientService.useCreate({
      onSuccess: (data) => {
        toast.success("Tooraine on edukalt lisatud");
        router.push(`/ingredients/${data.id}`);
      },
    });

  const { mutateAsync: updateMutateAsync } =
    services.ingredientService.useUpdate({
      onSuccess: () => toast.success("Tooraine on edukalt uuendatud"),
    });

  const { handleSubmit, Field, Subscribe } = useForm({
    defaultValues: {
      name: ingredient?.name || "",
      isActive: ingredient?.isActive || false,
      categoryId: ingredient?.category?.id || "",
      comments: ingredient?.comments || "",
    } as CreateIngredientDTO,
    validators: {
      onChange: createIngredientSchema,
    },
    onSubmit: async ({ value }) => {
      let imageResponse = null;

      if (image && ingredient?.imageUrl !== image.name) {
        const data = new FormData();
        data.append("image", image);
        const response = await fetch("/api/images", {
          method: "POST",
          body: data,
        });
        imageResponse = await response.json();
      }

      if (ingredient) {
        const isImageChanged =
          !(ingredient.imageUrl === image?.name) && imageResponse;

        const updatedIngredient = {
          id: ingredient.id,
          ...value,
        };

        if (isImageChanged) {
          updatedIngredient.imageUrl = imageResponse?.imageUrl;
        }
        await updateMutateAsync(setEmptyToNull(updatedIngredient));
      } else {
        await createMutateAsync(
          setEmptyToNull({
            ...value,
            imageUrl: imageResponse?.imageUrl,
          })
        );
      }
    },
  });

  const ingredientCategoriesData = ingredientCategories!.map((category) => ({
    key: category.id,
    value: category.name,
  }));

  return (
    <>
      {ingredient && (
        <IngredientDeleteModal
          ingredient={ingredient}
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
        />
      )}
      <PageHeader title="Lisa uus tooraine" />
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
            <FormRow
              title="Retsepti nimetus, kategooria valik ja valmistusaeg"
              contentClassName="flex-col"
            >
              <div className="flex gap-4">
                <Field
                  name="name"
                  children={(field) => (
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isField={false}
                      className="basis-2/3"
                      hasError={!!field.state.meta.errors.length}
                    />
                  )}
                />
                <Field
                  name="categoryId"
                  children={(field) => (
                    <Combobox
                      data={ingredientCategoriesData}
                      onChange={(value) => field.handleChange(value?.key)}
                      isField={false}
                      selected={field.state.value}
                      hasError={!!field.state.meta.errors.length}
                    />
                  )}
                />
              </div>
            </FormRow>
          </div>
          <div className="basis-1/4">
            <ImageUpload
              onChange={(file) => setImage(file)}
              imageUrl={ingredient?.imageUrl}
              selectedImage={image}
            />
            <Field
              name="comments"
              children={(field) => (
                <Textarea
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label="Kommentaarid"
                  description="Siia saad lisada üldise kommentaari tooraine kohta."
                  rows={6}
                  textareaClassName="mt-6"
                  className="mt-8"
                />
              )}
            />
          </div>
        </div>
        <div className="flex justify-end mt-10 gap-3">
          <Subscribe
            selector={(state) => [state.isSubmitting]}
            children={([isSubmitting]) => (
              <Button
                isLoading={isSubmitting}
                disabled={isSubmitting}
                type="submit"
              >
                Salvesta
              </Button>
            )}
          />
          {ingredient && (
            <Button
              type="button"
              color="danger"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Kustuta
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
