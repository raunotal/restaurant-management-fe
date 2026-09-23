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
import { getErrorMessageEt } from "@/config/error-messages";
import FormField from "@/components/common/form-field";
import Divider from "@/components/ui/divider";
import {
  calculateColdProcessingLoss,
  calculateNetQuantity,
} from "@/utils/quantity";

type IngredientFormProps = {
  ingredient?: Ingredient;
};

type QuantityInputMode = "netQuantity" | "coldProcessingLoss";

export default function IngredientFrom(props: IngredientFormProps) {
  const { ingredient } = props;
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState<Unit | undefined>(
    ingredient?.unit
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [quantityInputMode, setQuantityInputMode] =
    useState<QuantityInputMode>("netQuantity");
  const ingredientCategories =
    services.ingredientCategoryService.useGetAll().data;
  const units = services.unitService.useGetAll().data;
  const suppliers = services.supplierService.useGetAll().data;
  const warehouses = services.ingredientWarehouseService.useGetAll().data;
  const queryClient = useQueryClient();
  const isDuplicate = ingredient && !ingredient.id;

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

  const form = useForm({
    defaultValues: {
      name: ingredient?.name || "",
      grossQuantity: ingredient?.grossQuantity || 0,
      netQuantity: ingredient?.netQuantity || 0,
      coldProcessingLoss:
        ingredient?.coldProcessingLoss ??
        calculateColdProcessingLoss(
          ingredient?.grossQuantity,
          ingredient?.netQuantity
        ),
      purchasePrice: ingredient?.purchasePrice || 0,
      warehouseMinQuantity: ingredient?.warehouseMinQuantity || "",
      unitId: ingredient?.unit.id || "",
      categoryId: ingredient?.category?.id || "",
      supplierId: ingredient?.supplier?.id || "",
      warehouseId: ingredient?.warehouse?.id || "",
      imageUrl: ingredient?.imageUrl || "",
      isActive: ingredient?.isActive ?? true,
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
        const result = await response.json();

        if (!response.ok) {
          const code = result?.error?.code as string | undefined;
          toast.error(getErrorMessageEt(code));
          return;
        }

        imageResponse = result;
      }

      if (ingredient && !isDuplicate) {
        const isImageChanged =
          !(ingredient.imageUrl === image?.name) && imageResponse;

        if (isImageRemoved && !image && ingredient.imageUrl) {
          try {
            const response = await fetch("/api/images", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageUrl: ingredient.imageUrl }),
            });

            if (!response.ok) {
              const result = await response.json().catch(() => null);
              const code = result?.error?.code as string | undefined;
              toast.error(getErrorMessageEt(code));
            }
          } catch (error) {
            console.error("Failed to delete ingredient image from S3", error);
            toast.error(getErrorMessageEt("IMAGE_DELETE_FAILED"));
          }
        }

        const updatedIngredient: CreateIngredientDTO & {
          id: string;
        } = {
          id: (ingredient as Ingredient).id,
          ...(value as CreateIngredientDTO),
        };

        if (isImageRemoved && !image) {
          updatedIngredient.imageUrl = "";
        } else if (isImageChanged && imageResponse?.imageUrl) {
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
  const { handleSubmit, Field, Subscribe, getFieldValue, setFieldValue } = form;

  // Only one of netQuantity / coldProcessingLoss is entered manually,
  // the other one is always derived from it and grossQuantity.
  const recalculateQuantities = () => {
    const grossQuantity = getFieldValue("grossQuantity");

    if (quantityInputMode === "netQuantity") {
      setFieldValue(
        "coldProcessingLoss",
        calculateColdProcessingLoss(grossQuantity, getFieldValue("netQuantity"))
      );
    } else {
      setFieldValue(
        "netQuantity",
        calculateNetQuantity(
          grossQuantity,
          getFieldValue("coldProcessingLoss")
        ) ?? 0
      );
    }
  };

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
      <IngredientDeleteModal
        ingredient={ingredient as Ingredient}
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
      />
      <PageHeader
        title={ingredient ? "Tooraine muutmine" : "Tooraine lisamine"}
        onClickText="Tagasi"
        onClick={() => router.push("/ingredients")}
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
              <Field
                name="name"
                children={(field) => (
                  <FormField
                    label="Tooraine nimetus"
                    id={field.name}
                    className="basis-3/5"
                  >
                    <Input
                      name={field.name}
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isField={false}
                      hasError={!!field.state.meta.errors.length}
                    />
                  </FormField>
                )}
              />
              <Field
                name="categoryId"
                children={(field) => (
                  <FormField label="Tooraine kategooria" className="basis-2/5">
                    <Combobox
                      data={ingredientCategoriesData}
                      onChange={(value) => field.handleChange(value?.key)}
                      isField={false}
                      selected={field.state.value}
                      hasError={!!field.state.meta.errors.length}
                    />
                  </FormField>
                )}
              />
            </FormRow>
            <FormRow>
              <Field
                name="productCode"
                children={(field) => (
                  <FormField
                    label="Toote kood"
                    id={field.name}
                    className="basis-2/5"
                  >
                    <Input
                      name={field.name}
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isField={false}
                      hasError={!!field.state.meta.errors.length}
                    />
                  </FormField>
                )}
              />
              <Field
                name="supplierId"
                children={(field) => (
                  <FormField label="Tarnija" className="basis-3/5">
                    <Combobox
                      data={suppliersData}
                      onChange={(value) => field.handleChange(value?.key)}
                      isField={false}
                      selected={field.state.value}
                      hasError={!!field.state.meta.errors.length}
                    />
                  </FormField>
                )}
              />
            </FormRow>
            <Divider />
            <FormRow>
              <Field
                name="warehouseId"
                children={(field) => (
                  <FormField label="Ladu" className="basis-2/5">
                    <Combobox
                      data={warehouseData}
                      onChange={(value) => field.handleChange(value?.key)}
                      isField={false}
                      selected={field.state.value}
                      hasError={!!field.state.meta.errors.length}
                    />
                  </FormField>
                )}
              />
              <Field
                name="shelfLife"
                children={(field) => (
                  <FormField
                    label="Säilivusaeg"
                    id={field.name}
                    className="basis-3/5"
                  >
                    <Input
                      name={field.name}
                      id={field.name}
                      defaultValue={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isField={false}
                      type="text"
                      hasError={!!field.state.meta.errors.length}
                    />
                  </FormField>
                )}
              />
            </FormRow>
            <FormRow>
              <Field
                name="bulkPackage"
                children={(field) => (
                  <FormField
                    label="Hulgipakk"
                    id={field.name}
                    className="basis-2/5"
                  >
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isField={false}
                      type="text"
                      hasError={!!field.state.meta.errors.length}
                    />
                  </FormField>
                )}
              />
              <Field
                name="warehouseMinQuantity"
                children={(field) => (
                  <FormField
                    label="Minimaalne kogus laos"
                    id={field.name}
                    className="basis-3/5"
                  >
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      isField={false}
                      type="text"
                      hasError={!!field.state.meta.errors.length}
                      placeholder="Näiteks: 5 pakki"
                    />
                  </FormField>
                )}
              />
            </FormRow>
            <Divider />
            <FormRow>
              <Field
                name="unitId"
                children={(field) => (
                  <FormField label="Ühik">
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
                  </FormField>
                )}
              />
              <Field
                name="grossQuantity"
                children={(field) => (
                  <FormField label="Brutokogus" id={field.name}>
                    <div className="flex items-center gap-2">
                      <Input
                        name={field.name}
                        defaultValue={
                          field.state.value === 0 ? "" : field.state.value
                        }
                        onChange={(e) => {
                          field.handleChange(+e.target.value);
                          recalculateQuantities();
                        }}
                        isField={false}
                        type="number"
                        step={0.001}
                        hasError={!!field.state.meta.errors.length}
                      />
                      {selectedUnit?.displayName}
                    </div>
                  </FormField>
                )}
              />
            </FormRow>
            <FormRow>
              <Field
                name="netQuantity"
                children={(field) => {
                  const isEditable = quantityInputMode === "netQuantity";
                  const value =
                    field.state.value === 0 ? "" : field.state.value;

                  return (
                    <FormField
                      label={
                        <QuantityInputModeLabel
                          label="Netokogus (toorkaal)"
                          checked={isEditable}
                          onChange={() => setQuantityInputMode("netQuantity")}
                        />
                      }
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          key={isEditable ? "editable" : "calculated"}
                          name={field.name}
                          {...(isEditable
                            ? { defaultValue: value }
                            : { value })}
                          onChange={(e) => {
                            field.handleChange(+e.target.value);
                            recalculateQuantities();
                          }}
                          disabled={!isEditable}
                          isField={false}
                          type="number"
                          step={0.001}
                          hasError={!!field.state.meta.errors.length}
                        />
                        {selectedUnit?.displayName}
                      </div>
                    </FormField>
                  );
                }}
              />
              <Field
                name="coldProcessingLoss"
                children={(field) => {
                  const isEditable = quantityInputMode === "coldProcessingLoss";
                  const value = field.state.value ?? "";

                  return (
                    <FormField
                      label={
                        <QuantityInputModeLabel
                          label="Külmtöötlemiskadu"
                          checked={isEditable}
                          onChange={() =>
                            setQuantityInputMode("coldProcessingLoss")
                          }
                        />
                      }
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          key={isEditable ? "editable" : "calculated"}
                          name={field.name}
                          {...(isEditable
                            ? { defaultValue: value }
                            : { value })}
                          onChange={(e) => {
                            field.handleChange(
                              e.target.value === ""
                                ? undefined
                                : +e.target.value
                            );
                            recalculateQuantities();
                          }}
                          disabled={!isEditable}
                          isField={false}
                          type="number"
                          step={0.01}
                          min={0}
                          max={100}
                          hasError={!!field.state.meta.errors.length}
                        />
                        %
                      </div>
                    </FormField>
                  );
                }}
              />
            </FormRow>
            <Divider />
            <FormRow>
              <Field
                name="purchasePrice"
                children={(field) => (
                  <FormField
                    label="Brutokoguse hind (käibemaksuta)"
                    id={field.name}
                  >
                    <div className="flex items-center gap-2">
                      <Input
                        name={field.name}
                        defaultValue={
                          field.state.value === 0 ? "" : field.state.value
                        }
                        onChange={(e) => field.handleChange(+e.target.value)}
                        isField={false}
                        type="number"
                        step={0.01}
                        hasError={!!field.state.meta.errors.length}
                      />
                      €
                    </div>
                  </FormField>
                )}
              />
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
              imageUrl={isImageRemoved ? undefined : ingredient?.imageUrl}
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
          {ingredient && !isDuplicate && (
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

type QuantityInputModeLabelProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

function QuantityInputModeLabel(props: QuantityInputModeLabelProps) {
  const { label, checked, onChange } = props;

  return (
    <span className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="quantityInputMode"
        checked={checked}
        onChange={onChange}
        className="accent-indigo-600 outline-hidden focus-visible:outline-indigo-600"
      />
      {label}
    </span>
  );
}
