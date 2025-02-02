import { IconType } from "@/config/types";
import React from "react";
import DashboardIcon from "./dashboard-icon";
import RecipesIcon from "./recipes-icon";

interface IconComponentProps extends IconProps {
  type: IconType;
}

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon(props: IconComponentProps) {
  const { type, ...iconProps } = props;

  iconProps.className = "text-gray-400";

  let IconComponent: React.ReactNode;

  switch (type) {
    case "home":
      IconComponent = <DashboardIcon {...iconProps} />;
      break;
    case "recipes":
      IconComponent = <RecipesIcon {...iconProps} />;
      break;
    default:
      IconComponent = null;
  }

  return IconComponent;
}
