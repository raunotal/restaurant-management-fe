import { Unit } from "@/types/unit";

export type IconType = "home";

export type ModalProps = {
  isOpen: boolean;
  unit?: Unit;
  setIsOpen: (isOpen: boolean) => void;
};
