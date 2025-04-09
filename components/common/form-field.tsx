import classNames from "classnames";
import React from "react";

type FormFieldProps = {
  label: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export default function FormField(props: FormFieldProps) {
  const { label, id, className, children } = props;
  return (
    <div className={classNames("flex flex-col gap-2", className)}>
      <label className="font-semibold" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}
