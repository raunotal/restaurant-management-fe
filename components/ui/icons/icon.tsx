import { IconType } from "@/config/types";
import React from "react";
import DashboardIcon from "./dashboard-icon";
import RecipesIcon from "./recipes-icon";
import IngredientsIcon from "./ingredients-icon";
import SignOutIcon from "./sign-out-icon";
import classNames from "classnames";
import EditIcon from "./edit-icon";
import DuplicateIcon from "./duplicate-icon";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import ChevronUpIcon from "@heroicons/react/24/solid/ChevronUpIcon";

interface IconComponentProps extends IconProps {
  type: IconType;
}

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}


// TODO: replace icons with heroicons
const ICON_COMPONENTS = {
  home: DashboardIcon,
  recipes: RecipesIcon,
  ingredients: IngredientsIcon,
  signout: SignOutIcon,
  edit: EditIcon,
  duplicate: DuplicateIcon,
  "chevron-up": ChevronUpIcon,
  "chevron-down": ChevronDownIcon,
} as const;

export default function Icon(props: IconComponentProps) {
  const {
    className,
    size = 24,
    color = "currentColor",
    type,
    ...iconProps
  } = props;

  const IconComponent = ICON_COMPONENTS[type];

  return (
    <IconComponent
      {...iconProps}
      className={classNames(
        "text-gray-400 group-hover:text-indigo-600",
        className
      )}
      size={size}
      width={size}
      height={size}
      color={color}
    />
  );
}
