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
import { Unit } from "@/types/unit";
import { useQueryClient } from "@tanstack/react-query";
import { Endpoints } from "@/config/endpoints";

type IngredientFormProps = {
  ingredient?: Ingredient;
};

export default function IngredientFrom(props: IngredientFormProps) {
  const { ingredient } = props;
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState<Unit | undefined>(
    ingredient?.unit
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const ingredientCategories =
    services.ingredientCategoryService.useGetAll().data;
  const units = services.unitService.useGetAll().data;
  const suppliers = services.supplierService.useGetAll().data;
  const warehouses = services.ingredientWarehouseService.useGetAll().data;
  const queryClient = useQueryClient();

  const { mutateAsync: createMutateAsync } =
    services.ingredientService.useCreate({
      onSuccess: (data) => {
        toast.success("Tooraine on edukalt lisatud");
        queryClient.invalidateQueries({ queryKey: [Endpoints.Ingredients] });
        router.push(`/ingredients/${data.id}`);
      },
    });

  const { mutateAsync: updateMutateAsync } =
    services.ingredientService.useUpdate({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [Endpoints.Ingredients] });
        toast.success("Tooraine on edukalt uuendatud");
      },
    });

  const { handleSubmit, Field, Subscribe } = useForm({
    defaultValues: {
      name: ingredient?.name || "",
      grossQuantity: ingredient?.grossQuantity || "",
      netQuantity: ingredient?.netQuantity || "",
      purchasePrice: ingredient?.purchasePrice || "",
      warehouseMinQuantity: ingredient?.warehouseMinQuantity || "",
      unitId: ingredient?.unit.id || "",
      categoryId: ingredient?.category?.id || "",
      supplierId: ingredient?.supplier?.id || "",
      warehouseId: ingredient?.warehouse?.id || "",
      imageUrl: ingredient?.imageUrl || "",
      isActive: ingredient?.isActive || false,
      bulkPackage: ingredient?.bulkPackage || "",
      comments: ingredient?.comments || "",
      shelfLife: ingredient?.shelfLife || "",
      productCode: ingredient?.productCode || "",
    } as CreateIngredientDTO,
    validators: {
      onSubmit: createIngredientSchema,
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

  const unitsData = units!.map((unit) => ({
    key: unit.id,
    value: unit.name,
  }));

  const suppliersData = suppliers!.map((supplier) => ({
    key: supplier.id,
    value: supplier.name,
  }));

  const warehouseData = warehouses!.map((warehouse) => ({
    key: warehouse.id,
    value: warehouse.name,
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
      <PageHeader
        title={ingredient ? "Tooraine muutmine" : "Tooraine lisamine"}
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
            <FormRow
              title="Tooraine nimetus ja kategooria"
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
            <FormRow
              title="Tootekood ja Tarnija"
              contentClassName="flex-col"
            >
              <div className="flex gap-4">
                <Field
                  name="productCode"
                  children={(field) => (
                    <div className="flex flex-auto items-center gap-2 basis-1/2">
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        isField={false}
                        className="w-full"
                        hasError={!!field.state.meta.errors.length}
                      />
                    </div>
                  )}
                />
                <Field
                  name="supplierId"
                  children={(field) => (
                    <Combobox
                      data={suppliersData}
                      onChange={(value) => field.handleChange(value?.key)}
                      isField={false}
                      selected={field.state.value}
                      hasError={!!field.state.meta.errors.length}
                      className="basis-1/2"
                    />
                  )}
                />
              </div>
            </FormRow>
            <FormRow title="Ladu">
              <Field
                name="warehouseId"
                children={(field) => {
                  return (
                    <Combobox
                      data={warehouseData}
                      onChange={(value) => field.handleChange(value?.key)}
                      isField={false}
                      selected={field.state.value}
                      hasError={!!field.state.meta.errors.length}
                    />
                  );
                }}
              />
            </FormRow>
            <FormRow title="Säilivusaeg">
              <Field
                name="shelfLife"
                children={(field) => (
                  <div className="flex flex-auto items-center gap-2">
                    <Input
                      name={field.name}
                      defaultValue={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isField={false}
                      type="text"
                      hasError={!!field.state.meta.errors.length}
                    />
                  </div>
                )}
              />
            </FormRow>
            <FormRow title="Ühik">
              <Field
                name="unitId"
                children={(field) => (
                  <Combobox
                    data={unitsData}
                    onChange={(value) => {
                      setSelectedUnit(
                        units.find((unit) => unit.id === value?.key)
                      );
                      field.handleChange(value?.key);
                    }}
                    isField={false}
                    selected={field.state.value}
                    hasError={!!field.state.meta.errors.length}
                  />
                )}
              />
            </FormRow>
            <FormRow title="Miinimumkogus laos">
              <Field
                name="warehouseMinQuantity"
                children={(field) => (
                  <div className="flex flex-auto items-center gap-2">
                    <Input
                      name={field.name}
                      defaultValue={field.state.value}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      isField={false}
                      type="number"
                      hasError={!!field.state.meta.errors.length}
                      className="basis-1/4"
                      step={0.001}
                    />
                    {selectedUnit?.displayName}
                  </div>
                )}
              />
            </FormRow>
            <FormRow title="Brutokogus">
              <Field
                name="grossQuantity"
                children={(field) => (
                  <div className="flex flex-auto items-center gap-2">
                    <Input
                      name={field.name}
                      defaultValue={field.state.value}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      isField={false}
                      className="basis-1/4"
                      type="number"
                      step={0.001}
                      hasError={!!field.state.meta.errors.length}
                    />
                    {selectedUnit?.displayName}
                  </div>
                )}
              />
            </FormRow>
            <FormRow title="Netokogus">
              <Field
                name="netQuantity"
                children={(field) => (
                  <div className="flex flex-auto items-center gap-2">
                    <Input
                      name={field.name}
                      defaultValue={field.state.value}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      isField={false}
                      className="basis-1/4"
                      type="number"
                      step={0.001}
                      hasError={!!field.state.meta.errors.length}
                    />
                    {selectedUnit?.displayName}
                  </div>
                )}
              />
            </FormRow>
            <FormRow title="Brutokoguse hind (käibemaksuta)">
              <Field
                name="purchasePrice"
                children={(field) => (
                  <div className="flex flex-auto items-center gap-2">
                    <Input
                      name={field.name}
                      defaultValue={field.state.value}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      isField={false}
                      className="basis-1/4"
                      type="number"
                      step={0.01}
                      hasError={!!field.state.meta.errors.length}
                    />
                    €
                  </div>
                )}
              />
            </FormRow>
            <FormRow title="Hulgipakk">
              <Field
                name="bulkPackage"
                children={(field) => (
                  <div className="flex flex-auto items-center gap-2">
                    <Input
                      name={field.name}
                      defaultValue={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isField={false}
                      className="basis-1/4"
                      type="text"
                      hasError={!!field.state.meta.errors.length}
                    />
                  </div>
                )}
              />
            </FormRow>
          </div>
          <div className="basis-1/4">
            <ImageUpload
              onChange={(file) => setImage(file)}
              imageUrl={ingredient?.imageUrl}
              selectedImage={image}
              type="ingredient"
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
