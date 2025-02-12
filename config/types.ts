export type IconType = "home" | "recipes" | "ingredients" | "signout";

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
