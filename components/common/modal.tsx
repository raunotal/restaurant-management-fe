"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

// { isOpen, onClose, children }
interface ModalProps {
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = (props: ModalProps) => {
  const { isOpen, className, onClose, children } = props;
  const [isModalMounted, setIsModalMounted] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" ? onClose && onClose() : null;
    document.body.addEventListener("keydown", closeOnEscapeKey);
    setIsModalMounted(true);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [onClose]);

  console.log("modalRef before", modalRef);
  if (!isOpen) return null;

  console.log("modalRef after", modalRef);

  return (
    isModalMounted &&
    createPortal(
      <div className="modal">
        <div className="modal__backdrop" onClick={onClose}></div>
        <div ref={modalRef} className={classNames("modal__content", className)}>
          {children}
        </div>
      </div>,
      document.body
    )
  );
};

export default Modal;
