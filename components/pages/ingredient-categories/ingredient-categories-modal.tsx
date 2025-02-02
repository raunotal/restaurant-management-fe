import Modal from "@/components/layout/modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ModalProps } from "@/config/types";
import services from "@/service/services";
import {
  CreateIngredientCategoryDTO,
  createIngredientCategorySchema,
  IngredientCategory,
} from "@/types/ingredient-category";
import { setEmptyToNull } from "@/utils/helpers";
import { DialogTitle } from "@headlessui/react";
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";

type IngredientCategoryModalProps = ModalProps & {
  ingredientCategory?: IngredientCategory;
};

export default function IngredientCategoriesModal(
  props: IngredientCategoryModalProps
) {
  const { ingredientCategory, setIsOpen, isOpen } = props;
  const { useCreate, useDelete, useUpdate } =
    services.ingredientCategoryService;

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
      name: ingredientCategory?.name || "",
      description: ingredientCategory?.description || "",
    } as CreateIngredientCategoryDTO,
    onSubmit: ({ value }) => {
      if (ingredientCategory) {
        updateMutateAsync(
          setEmptyToNull({ ...value, id: ingredientCategory.id })
        );
      } else {
        createMutateAsync(setEmptyToNull(value));
      }
    },
    validators: {
      onChange: createIngredientCategorySchema,
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
        {ingredientCategory
          ? "Muuda tooraine kategooriat"
          : "Lisa tooraine kategooria"}
      </DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
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
                {ingredientCategory && (
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => {
                      deleteMutateAsync(ingredientCategory);
                    }}
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
