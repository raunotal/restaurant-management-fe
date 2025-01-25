import Modal from "@/components/layout/modal";
import Button from "@/components/ui/button";
import { DialogTitle, Description } from "@headlessui/react";
import React from "react";

interface AddUnitModalProps {
  isOpen: boolean;
  isEditing?: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AddUnitModal(props: AddUnitModalProps) {
  const { isEditing, setIsOpen } = props;
  return (
    <Modal {...props}>
      <DialogTitle className="font-bold">
        {isEditing ? "Muuda ühikut" : "Lisa uus ühik"}
      </DialogTitle>
      <Description></Description>
      <div className="flex gap-4">
        <Button onClick={() => setIsOpen(false)}>Salvesta</Button>
        <Button onClick={() => setIsOpen(false)}>Sulge</Button>
      </div>
    </Modal>
  );
}
