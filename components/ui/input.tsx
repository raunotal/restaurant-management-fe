import { IconType } from "@/config/types";
import classNames from "classnames";
import React from "react";

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  background?: "dark" | "light" | "white" | "transparent";
  icon?: IconType;
  hasError?: boolean;
}

export default function Input(props: InputProps) {
  const { background = "white", icon, hasError, ...rest } = props;

  return (
    <div className={classNames("input", { "input--icon": icon })}>
      <input
        className={classNames(`input--${background}`, { error: hasError })}
        {...rest}
      />
    </div>
  );
}
