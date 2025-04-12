import React from "react";
import Button from "../ui/button";

type PageHeaderProps = {
  title: string;
  description?: string;
  onClickText?: string;
  onClick?: () => void;
};

export default function PageHeader({
  title,
  description,
  onClickText,
  onClick,
}: PageHeaderProps) {
  return (
    <div className="flex items-center min-h-[52px]">
      <div className="flex-1">
        <h3>{title}</h3>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
      </div>
      {onClick && (
        <div>
          <Button onClick={onClick}>{onClickText}</Button>
        </div>
      )}
    </div>
  );
}
