import Modal from "@/components/layout/modal";
import Combobox, { ComboboxElement } from "@/components/ui/combobox";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useUnits } from "@/requests/units";
import { DialogTitle } from "@headlessui/react";
import React, { useState } from "react";

interface UnitModalProps {
  isOpen: boolean;
  isEditing?: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function UnitModal(props: UnitModalProps) {
  const { isEditing, setIsOpen } = props;
  const { data: units } = useUnits();
  const [selectedParentUnit, setSelectedParentUnit] =
    useState<ComboboxElement>();

  return (
    <Modal {...props}>
      <DialogTitle className="font-bold">
        {isEditing ? "Muuda ühikut" : "Lisa uus ühik"}
      </DialogTitle>
      <Input name="name" label="Nimi" />
      <Input name="displayName" label="Lühend" />
      <Combobox
        label="Pea ühik"
        data={units.map((unit) => ({ key: unit.id, value: unit.name }))}
        selected={selectedParentUnit}
        onChange={setSelectedParentUnit}
      />
      <Input name="ratio" label="Suhe" type="number" step={0.001} min={0.001} />
      <div className="flex gap-4">
        <Button onClick={() => setIsOpen(false)}>Salvesta</Button>
        <Button onClick={() => setIsOpen(false)}>Sulge</Button>
      </div>
    </Modal>
  );
}
