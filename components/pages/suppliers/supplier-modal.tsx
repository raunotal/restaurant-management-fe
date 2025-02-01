import Modal from "@/components/layout/modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { DialogTitle } from "@headlessui/react";
import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { setEmptyToNull } from "@/utils/helpers";
import { ModalProps } from "@/config/types";
import {
  useCreateSupplier,
  useDeleteSupplier,
  useUpdateSupplier,
} from "@/requests/suppliers";
import {
  CreateSupplierDTO,
  createSupplierSchema,
  Supplier,
} from "@/types/supplier";

type SupplierModalProps = ModalProps & {
  supplier?: Supplier;
};

export default function SupplierModal(props: SupplierModalProps) {
  const { supplier, setIsOpen, isOpen } = props;

  const { mutateAsync: createMutateAsync } = useCreateSupplier({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { mutateAsync: deleteMutateAsync } = useDeleteSupplier({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { mutateAsync: updateMutateAsync } = useUpdateSupplier({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      name: supplier?.name || "",
      address: supplier?.address || "",
    } as CreateSupplierDTO,
    onSubmit: ({ value }) => {
      if (supplier) {
        updateMutateAsync(setEmptyToNull({ ...value, id: supplier.id }));
      } else {
        createMutateAsync(setEmptyToNull(value));
      }
    },
    validators: {
      onChange: createSupplierSchema,
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
        {supplier ? "Muuda tarnijat" : "Lisa uus tarnija"}
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
          name="address"
          children={(field) => (
            <Input
              name={field.name}
              label="Aadress"
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
                {supplier && (
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => deleteMutateAsync(supplier)}
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
