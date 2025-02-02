import React from "react";
import Button from "../ui/button";

type PageHeaderProps = {
  title: string;
  description: string;
  onClick: () => void;
};

export default function PageHeader({
  title,
  description,
  onClick,
}: PageHeaderProps) {
  return (
    <div className="flex items-center">
      <div className="flex-1">
        <h3>{title}</h3>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
      </div>
      <div>
        <Button onClick={onClick}>Lisa uus</Button>
      </div>
    </div>
  );
}
