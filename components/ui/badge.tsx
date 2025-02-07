"use client";

import classNames from "classnames";

type BadgeProps = {
  color?: "primary" | "active";
  dot?: boolean;
  text: string;
  className?: string;
  onClick?: () => void;
};

export default function Badge({ text, color, dot, className, onClick }: BadgeProps) {
  const badgeClassName = classNames(
    "bg-gray-200 text-gray-600 rounded-full px-2.5 py-2 flex items-center gap-2 text-[12px] leading-[1] font-semibold w-min",
    color === "active" && "bg-green-100 text-green-600",
    color === "primary" && "bg-indigo-100 text-indigo-600",
    !!onClick && "cursor-pointer",
    className
  );

  return (
    <div className={badgeClassName} onClick={onClick}>
      {dot && (
        <span
          className={classNames(
            "w-2 h-2 bg-gray-400 rounded-md",
            color === "active" && "bg-green-600",
            color === "primary" && "bg-indigo-600"
          )}
        />
      )}
      {text}
    </div>
  );
}
