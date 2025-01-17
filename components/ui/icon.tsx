import { IconType } from "@/config/types";
import classNames from "classnames";

interface IconProps {
  fill?: "dark" | "light" | "gray";
  size?: "small" | "regular";
  type: IconType;
  className?: string;
  onClick?: () => void;
}

export default function Icon(props: IconProps) {
  const { fill = "gray", size = "regular", type, className, onClick } = props;
  return (
    <span
      className={classNames(
        "icon",
        `icon--${type}`,
        `icon--fill-${fill}`,
        `icon--size-${size}`,
        className
      )}
      onClick={onClick}
    />
  );
}
