import React from "react";
import { IconProps } from "./icon";
import classNames from "classnames";

export default function RecipesIcon({ size, color, className }: IconProps) {
  return (
    <svg
      fill="#000000"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      stroke={color}
      className={classNames(className, "group-hover:text-indigo-600")}
      width={size}
      height={size}
    >
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M6.33,18.45v8.59c0,.41,.34,.75,.75,.75h15.13c.41,0,.75-.34,.75-.75v-8.6c1.91-.75,3.27-2.6,3.27-4.77,0-2.83-2.3-5.13-5.13-5.13-.56,0-1.13,.1-1.67,.28-1.2-1.87-3.24-3.01-5.49-3.01s-4.09,1.02-5.31,2.75c-3.06-.27-5.56,2.14-5.56,5.11,0,2.17,1.36,4.02,3.27,4.77Zm1.5,7.84v-1.87h13.63v1.87H7.83Zm13.63-7.48v4.11H7.83v-4.11h13.63ZM8.19,10.05c.18,0,.36,.02,.56,.05,0,0,.01,0,.02,0,1.72,.33,2.97,1.83,2.97,3.57,0,.41,.34,.75,.75,.75s.75-.34,.75-.75c0-2.05-1.23-3.85-3.04-4.67,.94-1.07,2.29-1.7,3.74-1.7,1.91,0,3.64,1.07,4.5,2.79,.09,.18,.25,.31,.43,.38,.19,.06,.39,.05,.57-.04,.52-.26,1.09-.4,1.65-.4,2,0,3.63,1.63,3.63,3.63s-1.63,3.63-3.63,3.63H8.19c-2,0-3.63-1.63-3.63-3.63s1.63-3.63,3.63-3.63Z"></path>
      </g>
    </svg>
  );
}
