import React, { useEffect, useState } from "react";
import Modal from "../common/modal";
import { useForm } from "@tanstack/react-form";
import Button from "../ui/button";
import {
  useCreateRecipeCategory,
  useDeleteRecipeCategory,
  useRecipeCategories,
  useUpdateRecipeCategory,
} from "@/service/recipe-categories";
import {
  RecipeCategory,
  recipeCategoryMutationSchema,
} from "@/types/recipe-category";
import FormField from "../ui/form-field";

interface AddRecipeCategoryProps {
  isOpen: boolean;
  onClose: () => void;
}

function FormCategory(props: RecipeCategory) {
  const { id, name } = props;
  const [isEditing, setIsEditing] = useState(false);
  const updateCategory = useUpdateRecipeCategory();
  const deleteCategory = useDeleteRecipeCategory();

  const form = useForm({
    defaultValues: {
      name,
    },
    onSubmit: async ({ value }) =>
      await updateCategory.mutateAsync({ ...value, id }),
    validators: {
      onChange: recipeCategoryMutationSchema,
    },
  });

  useEffect(() => {
    if (updateCategory.isSuccess) {
      setIsEditing(false);
    }
  }, [updateCategory.isSuccess]);

  const toggleEditing = () => setIsEditing((prevState) => !prevState);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleUpdate();
    }
  };

  const handleUpdate = async () => {
    form.handleSubmit();
  };

  const handleDelete = async () => {
    await deleteCategory.mutateAsync(id!);
  };

  return (
    <div className="flex flex--align-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          children={(field) => (
            <FormField
              id={field.name}
              name={field.name}
              value={field.state.value}
              disabled={!isEditing}
              background={isEditing ? "white" : "transparent"}
              errors={field.state.meta.errors}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          )}
        />
      </form>
    </div>
  );
}

export default function RecipeCategoryModal(props: AddRecipeCategoryProps) {
  const { onClose } = props;

  const { recipeCategories } = useRecipeCategories();
  const createRecipeCategory = useCreateRecipeCategory();

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) =>
      await createRecipeCategory.mutateAsync(value),
    validators: {
      onChange: recipeCategoryMutationSchema,
    },
  });

  useEffect(() => {
    if (createRecipeCategory.isSuccess) {
      form.reset();
    }
  }, [createRecipeCategory.isSuccess, form]);

  return (
    <Modal onClose={onClose} isOpen className="flex flex--direction-column">
      {recipeCategories?.map((category) => (
        <FormCategory key={category.id} {...category} />
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex--direction-column"
      >
        <form.Field
          name="name"
          children={(field) => (
            <FormField
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Lisa uus kategooria"
              errors={field.state.meta.errors}
              className="mt-1"
              showErrors
            />
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit || isSubmitting}
              textCentered
              theme="dark"
              type="submit"
              width="full"
            >
              Lisa
            </Button>
          )}
        />
      </form>
    </Modal>
  );
}
