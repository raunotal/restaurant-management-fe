"use client";

import PageHeader from "@/components/layout/page-header";
import Badge from "@/components/ui/badge";
import services from "@/service/services";
import { CreateRecipeDTO, createRecipeSchema, Recipe } from "@/types/recipe";
import { setEmptyToNull } from "@/utils/helpers";
import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "../../common/image-upload";
import TimeInput from "./time-input";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import Switch from "@/components/ui/switch";
import RecipeDeleteModal from "./recipe-delete-modal";
import { useRouter } from "next/navigation";
import FormRow from "@/components/common/form-row";
import { useQueryClient } from "@tanstack/react-query";
import { Endpoints } from "@/config/endpoints";
import { getErrorMessageEt } from "@/config/error-messages";

type RecipeFormProps = {
  recipe?: Recipe;
};

export default function RecipesFrom(props: RecipeFormProps) {
  const { recipe } = props;
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const recipeCategories = services.recipeCategoryService.useGetAll().data;
  const queryClient = useQueryClient();

  const { mutateAsync: createMutateAsync } = services.recipeService.useCreate({
    onSuccess: (data) => {
      toast.success("Retsept on edukalt lisatud");
      queryClient.invalidateQueries({ queryKey: [Endpoints.Recipes] });
      router.push(`/recipes/${data.id}`);
    },
  });

  const { mutateAsync: updateMutateAsync } = services.recipeService.useUpdate({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Endpoints.Recipes] });
      toast.success("Retsept on edukalt uuendatud");
    },
  });

  const { handleSubmit, Field, Subscribe } = useForm({
    defaultValues: {
      name: recipe?.name || "",
      isActive: recipe?.isActive ?? true,
      categoryId: recipe?.category?.id || "",
      preparationTime: recipe?.preparationTime || 0,
      comments: recipe?.comments || "",
    } as CreateRecipeDTO,
    validators: {
      onChange: createRecipeSchema,
    },
    onSubmit: async ({ value }) => {
      let imageResponse = null;

      if (image && recipe?.imageUrl !== image.name) {
        const data = new FormData();
        data.append("image", image);
        const response = await fetch("/api/images", {
          method: "POST",
          body: data,
        });
        const result = await response.json();

        if (!response.ok) {
          const code = result?.error?.code as string | undefined;
          toast.error(getErrorMessageEt(code));
          return;
        }

        imageResponse = result;
      }

      if (recipe) {
        const isImageChanged =
          !(recipe.imageUrl === image?.name) && imageResponse;

        if (isImageRemoved && !image && recipe.imageUrl) {
          try {
            const response = await fetch("/api/images", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageUrl: recipe.imageUrl }),
            });

            if (!response.ok) {
              const result = await response.json().catch(() => null);
              const code = result?.error?.code as string | undefined;
              toast.error(getErrorMessageEt(code));
            }
          } catch (error) {
            console.error("Failed to delete recipe image from S3", error);
            toast.error(getErrorMessageEt("IMAGE_DELETE_FAILED"));
          }
        }

        const updatedRecipe: CreateRecipeDTO & { id: string } = {
          id: recipe.id,
          ...(value as CreateRecipeDTO),
        };

        if (isImageRemoved && !image) {
          updatedRecipe.imageUrl = "";
        } else if (isImageChanged && imageResponse?.imageUrl) {
          updatedRecipe.imageUrl = imageResponse?.imageUrl;
        }
        await updateMutateAsync(setEmptyToNull(updatedRecipe));
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

  const recipeCategoriesData = recipeCategories!.map((category) => ({
    key: category.id,
    value: category.name,
  }));

  return (
    <>
      {recipe && (
        <RecipeDeleteModal
          recipe={recipe}
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
        />
      )}
      <PageHeader
        title="Lisa uus retsept"
        onClickText="Tagasi"
        onClick={() => router.push("/recipes")}
      />
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
            <FormRow>
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
                      data={recipeCategoriesData}
                      onChange={(value) => field.handleChange(value?.key)}
                      isField={false}
                      selected={field.state.value}
                      hasError={!!field.state.meta.errors.length}
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
            </FormRow>
          </div>
          <div className="basis-1/4">
            <ImageUpload
              onChange={(file) => {
                setImage(file);
                if (file) {
                  setIsImageRemoved(false);
                }
              }}
              onRemove={() => {
                setImage(null);
                setIsImageRemoved(true);
              }}
              imageUrl={isImageRemoved ? undefined : recipe?.imageUrl}
              selectedImage={image}
              type="recipe"
            />
            <Field
              name="comments"
              children={(field) => (
                <Textarea
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  label="Kommentaarid"
                  description="Siia saad lisada üldise kommentaari retsepti kohta."
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
          {recipe && (
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
