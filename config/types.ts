export type IconType =
  | "home"
  | "recipes"
  | "ingredients"
  | "signout"
  | "duplicate"
  | "edit"
  | "chevron-up"
  | "chevron-down";

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
