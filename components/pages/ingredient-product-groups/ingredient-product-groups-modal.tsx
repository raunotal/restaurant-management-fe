import Modal from "@/components/layout/modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Endpoints } from "@/config/endpoints";
import { ModalProps } from "@/config/types";
import services from "@/service/services";
import {
  CreateIngredientProductGroupDTO,
  createIngredientProductGroupSchema,
  IngredientProductGroup,
} from "@/types/ingredient-product-group";
import { setEmptyToNull } from "@/utils/helpers";
import { DialogTitle } from "@headlessui/react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type IngredientProductGroupsModalProps = ModalProps & {
  ingredientProductGroup?: IngredientProductGroup;
};

export default function IngredientProductGroupsModal(
  props: IngredientProductGroupsModalProps
) {
  const { ingredientProductGroup, setIsOpen, isOpen } = props;
  const { useCreate, useDelete, useUpdate } = services.ingredientProductGroupService;
  const queryClient = useQueryClient();

  const { mutateAsync: createMutateAsync } = useCreate({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Endpoints.IngredientProductGroups],
      });
      setIsOpen(false);
    },
  });

  const { mutateAsync: deleteMutateAsync } = useDelete({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Endpoints.IngredientProductGroups],
      });
      setIsOpen(false);
    },
  });

  const { mutateAsync: updateMutateAsync } = useUpdate({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Endpoints.IngredientProductGroups],
      });
      setIsOpen(false);
    },
  });

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      name: ingredientProductGroup?.name || "",
      description: ingredientProductGroup?.description || "",
    } as CreateIngredientProductGroupDTO,
    onSubmit: ({ value }) => {
      if (ingredientProductGroup) {
        updateMutateAsync(setEmptyToNull({ ...value, id: ingredientProductGroup.id }));
      } else {
        createMutateAsync(setEmptyToNull(value));
      }
    },
    validators: {
      onChange: createIngredientProductGroupSchema,
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
        {ingredientProductGroup
          ? "Muuda tooraine tooterühma"
          : "Lisa tooraine tooterühm"}
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
                {ingredientProductGroup && (
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => deleteMutateAsync(ingredientProductGroup)}
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
