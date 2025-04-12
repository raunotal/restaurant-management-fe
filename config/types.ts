export type IconType =
  | "home"
  | "recipes"
  | "ingredients"
  | "signout"
  | "duplicate"
  | "edit";

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
