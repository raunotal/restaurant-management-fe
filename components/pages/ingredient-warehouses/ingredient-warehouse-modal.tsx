import Modal from "@/components/layout/modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Endpoints } from "@/config/endpoints";
import { ModalProps } from "@/config/types";
import services from "@/service/services";
import {
  IngredientWarehouse,
  CreateIngredientWarehouseDTO,
  createIngredientWarehouseSchema,
} from "@/types/ingredient-warehouse";
import { setEmptyToNull } from "@/utils/helpers";
import { DialogTitle } from "@headlessui/react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type IngredientWarehouseModalProps = ModalProps & {
  ingredientWarehouse?: IngredientWarehouse;
};

export default function IngredientCategoriesModal(
  props: IngredientWarehouseModalProps
) {
  const { ingredientWarehouse, setIsOpen, isOpen } = props;
  const queryClient = useQueryClient();
  const { useCreate, useDelete, useUpdate } =
    services.ingredientWarehouseService;

  const { mutateAsync: createMutateAsync } = useCreate({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Endpoints.IngredientWarehouses],
      });
      setIsOpen(false);
    },
  });

  const { mutateAsync: deleteMutateAsync } = useDelete({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Endpoints.IngredientWarehouses],
      });
      setIsOpen(false);
    },
  });

  const { mutateAsync: updateMutateAsync } = useUpdate({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Endpoints.IngredientWarehouses],
      });
      setIsOpen(false);
    },
  });

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      name: ingredientWarehouse?.name || "",
      description: ingredientWarehouse?.description || "",
    } as CreateIngredientWarehouseDTO,
    onSubmit: ({ value }) => {
      if (ingredientWarehouse) {
        updateMutateAsync(
          setEmptyToNull({ ...value, id: ingredientWarehouse.id })
        );
      } else {
        createMutateAsync(setEmptyToNull(value));
      }
    },
    validators: {
      onChange: createIngredientWarehouseSchema,
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
        {ingredientWarehouse
          ? "Muuda tooraine ladu"
          : "Lisa tooraine ladu"}
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
                {ingredientWarehouse && (
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => {
                      deleteMutateAsync(ingredientWarehouse);
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
