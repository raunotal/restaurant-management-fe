import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export default function Modal(props: ModalProps) {
  const { isOpen, setIsOpen, children } = props;
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 bg-white p-12 rounded-xl">
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
