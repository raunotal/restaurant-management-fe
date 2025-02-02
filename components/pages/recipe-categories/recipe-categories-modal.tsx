import Modal from "@/components/layout/modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ModalProps } from "@/config/types";
import services from "@/service/services";
import {
  CreateRecipeCategoryDTO,
  createRecipeCategorySchema,
  RecipeCategory,
} from "@/types/recipe-category";
import { setEmptyToNull } from "@/utils/helpers";
import { DialogTitle } from "@headlessui/react";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";

type RecipeCategoriesModalProps = ModalProps & {
  recipeCategory?: RecipeCategory;
};

export default function RecipeCategoriesModal(
  props: RecipeCategoriesModalProps
) {
  const { recipeCategory, setIsOpen, isOpen } = props;
  const { useCreate, useDelete, useUpdate } = services.recipeCategoryService;

  const { mutateAsync: createMutateAsync } = useCreate({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { mutateAsync: deleteMutateAsync } = useDelete({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { mutateAsync: updateMutateAsync } = useUpdate({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      name: recipeCategory?.name || "",
      description: recipeCategory?.description || "",
    } as CreateRecipeCategoryDTO,
    onSubmit: ({ value }) => {
      if (recipeCategory) {
        updateMutateAsync(setEmptyToNull({ ...value, id: recipeCategory.id }));
      } else {
        createMutateAsync(setEmptyToNull(value));
      }
    },
    validators: {
      onChange: createRecipeCategorySchema,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [reset, isOpen]);

  return (
    <Modal {...props}>
      <DialogTitle className="font-bold">
        {recipeCategory
          ? "Muuda retsepti kategooriat"
          : "Lisa retsepti kategooria"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Field
          name="name"
          children={(field) => (
            <Input
              name={field.name}
              label="Nimi"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              hasError={!!field.state.meta.errors.length}
            />
          )}
        />
        <Field
          name="description"
          children={(field) => (
            <Input
              name={field.name}
              label="Kirjeldus"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              hasError={!!field.state.meta.errors.length}
            />
          )}
        />
        <div className="flex gap-4 mt-6">
          <Subscribe
            children={() => (
              <>
                <Button type="submit">Salvesta</Button>
                <Button type="button" onClick={() => setIsOpen(false)}>
                  Sulge
                </Button>
                {recipeCategory && (
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => deleteMutateAsync(recipeCategory)}
                  >
                    Kustuta
                  </Button>
                )}
              </>
            )}
          />
        </div>
      </form>
    </Modal>
  );
}
