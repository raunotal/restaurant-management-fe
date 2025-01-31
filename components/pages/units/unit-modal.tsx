import Modal from "@/components/layout/modal";
import Combobox, { ComboboxElement } from "@/components/ui/combobox";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useCreateUnit, useDeleteUnit, useUnits } from "@/requests/units";
import { DialogTitle } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { CreateUnitDTO, createUnitSchema, Unit } from "@/types/unit";

interface UnitModalProps {
  isOpen: boolean;
  isEditing?: boolean;
  unit?: Unit;
  setIsOpen: (isOpen: boolean) => void;
}

export default function UnitModal(props: UnitModalProps) {
  const { isEditing, unit, setIsOpen, isOpen } = props;
  const { data: units } = useUnits();
  const [selectedParentUnit, setSelectedParentUnit] =
    useState<ComboboxElement>();

  useEffect(() => {
    setSelectedParentUnit({
      key: unit?.parentUnit?.id || "",
      value: unit?.parentUnit?.name || "",
    });
  }, [unit]);

  const { mutateAsync: createMutateAsync } = useCreateUnit({
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const { mutateAsync: deleteMutateAsync } = useDeleteUnit({
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
    onSubmit: ({ value }) => createMutateAsync(value),
    validators: {
      onChange: createUnitSchema,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedParentUnit(undefined);
      reset();
    }
  }, [reset, isOpen]);

  return (
    <Modal {...props}>
      <DialogTitle className="font-bold">
        {isEditing ? "Muuda ühikut" : "Lisa uus ühik"}
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
              selected={selectedParentUnit}
              onChange={(value) => {
                setSelectedParentUnit(value);
                field.handleChange(value.key);
              }}
            />
          )}
        />
        <Field
          name="ratio"
          children={(field) => (
            <Input
              name={field.name}
              label="Suhe"
              type="number"
              step={0.001}
              min={0.001}
              value={field.state.value === 0 ? "" : field.state.value}
              onChange={(e) => field.handleChange(+e.target.value)}
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
                  <Button type="button" onClick={() => deleteMutateAsync(unit)}>
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
