import classNames from "classnames";
import LoadingSpinner from "./loading-spinner";
import { IconType } from "@/config/types";
import Icon from "./icon";

interface ButtonProps {
  disabled?: boolean;
  icon?: IconType;
  iconPosition?: "left" | "right";
  loading?: boolean;
  textCentered?: boolean;
  theme?: "dark" | "light" | "white";
  type: "button" | "submit";
  width?: "full";
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  const {
    disabled,
    icon,
    iconPosition,
    loading,
    theme,
    type,
    textCentered,
    width,
    onClick,
    children,
  } = props;

  let buttonContent = (
    <>
      {icon && iconPosition === "left" && (
        <Icon fill="light" type={icon} className="button__icon--left" />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <Icon fill="light" type={icon} className="button__icon--right" />
      )}
    </>
  );

  if (loading) {
    buttonContent = <LoadingSpinner />;
  }

  return (
    <button
      className={classNames(
        "button",
        "button--text-size-14",
        "button--text-weight-500",
        `button--${theme}`,
        {
          "button--disabled": disabled,
        },
        {
          "button--width-full": width === "full",
        },
        {
          "button--text-center": textCentered,
        }
      )}
      type={type}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
}
