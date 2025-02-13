import Modal from "@/components/layout/modal";
import Combobox from "@/components/ui/combobox";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { DialogTitle } from "@headlessui/react";
import React, { useEffect } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { CreateUnitDTO, createUnitSchema, Unit } from "@/types/unit";
import { setEmptyToNull } from "@/utils/helpers";
import { ModalProps } from "@/config/types";
import services from "@/service/services";
import { useQueryClient } from "@tanstack/react-query";
import { Endpoints } from "@/config/endpoints";

type UnitModalProps = ModalProps & {
  unit?: Unit;
};

export default function UnitModal(props: UnitModalProps) {
  const { unit, setIsOpen, isOpen } = props;
  const { useGetAll, useCreate, useUpdate, useDelete } = services.unitService;
  const units = useGetAll().data;
  const queryClient = useQueryClient();

  const { mutateAsync: createMutateAsync } = useCreate({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Endpoints.Units] });
      setIsOpen(false);
    },
  });

  const { mutateAsync: deleteMutateAsync } = useDelete({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Endpoints.Units] });
      setIsOpen(false);
    },
  });

  const { mutateAsync: updateMutateAsync } = useUpdate({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Endpoints.Units] });
      setIsOpen(false);
    },
  });

  const { handleSubmit, Field, Subscribe, reset, store } = useForm({
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
      onSubmit: createUnitSchema,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [reset, isOpen]);

  const parentUnitId = useStore(store, (state) => state.values.parentUnitId);

  return (
    <Modal {...props}>
      <DialogTitle className="font-bold">
        {unit ? "Muuda ühikut" : "Lisa uus ühik"}
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
        <Field
          name="parentUnitId"
          children={(field) => (
            <Combobox
              label="Pea ühik"
              data={units.map((unit) => ({ key: unit.id, value: unit.name }))}
              selected={field.state.value}
              onChange={(value) => field.handleChange(value.key)}
            />
          )}
        />
        {parentUnitId && (
          <Field
            name="ratio"
            children={(field) => (
              <Input
                name={field.name}
                label="Suhe"
                type="number"
                step={0.001}
                min={0}
                value={field.state.value}
                onChange={(e) => field.handleChange(+e.target.value)}
                hasError={!!field.state.meta.errors.length}
              />
            )}
          />
        )}
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
