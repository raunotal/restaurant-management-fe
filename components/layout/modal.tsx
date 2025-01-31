import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import classNames from "classnames";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  className?: string;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

export default function Modal(props: ModalProps) {
  const { isOpen, setIsOpen, children, className } = props;
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      transition
      className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className={classNames(
            "max-w-lg space-y-4 bg-white p-12 rounded-xl min-w-[350px]",
            className
          )}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
