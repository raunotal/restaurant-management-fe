import Modal from "@/components/layout/modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useCreateUnit, useDeleteUnit, useUpdateUnit } from "@/requests/units";
import { DialogTitle } from "@headlessui/react";
import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { CreateUnitDTO, createUnitSchema } from "@/types/unit";
import { setEmptyToNull } from "@/utils/helpers";
import { ModalProps } from "@/config/types";
import { useCreateSupplier } from "@/requests/suppliers";

export default function SupplierModal(props: ModalProps) {
  const { unit, setIsOpen, isOpen } = props;

  const { mutateAsync: createMutateAsync } = useCreateSupplier({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { mutateAsync: deleteMutateAsync } = useDeleteUnit({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { mutateAsync: updateMutateAsync } = useUpdateUnit({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      name: unit?.name || "",
      displayName: unit?.displayName || "",
      parentUnitId: unit?.parentUnit?.id || "",
      ratio: unit?.ratio || 0,
    } as CreateUnitDTO,
    onSubmit: ({ value }) => {
      if (unit) {
        updateMutateAsync(setEmptyToNull({ ...value, id: unit.id }));
      } else {
        createMutateAsync(setEmptyToNull(value));
      }
    },
    validators: {
      onChange: createUnitSchema,
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
        {unit ? "Muuda tarnijat" : "Lisa uus tarnija"}
      </DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
          name="displayName"
          children={(field) => (
            <Input
              name={field.name}
              label="Lühend"
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
                {unit && (
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => deleteMutateAsync(unit)}
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
