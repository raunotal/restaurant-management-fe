import { ValidationError } from "@tanstack/react-form";
import React from "react";
import Input, { InputProps } from "./input";
import classNames from "classnames";

interface FieldInfoProps {
  errors: ValidationError[];
  showErrors?: boolean;
}

interface FormFieldProps extends InputProps, FieldInfoProps {}

function FieldInfo(props: FieldInfoProps) {
  const { errors } = props;
  return errors?.map((error) => (
    <span key={error?.toString()} className="form-field__error">
      {error}
    </span>
  ));
}

export default function FormField(props: FormFieldProps) {
  const { className, errors, showErrors, ...rest } = props;
  console.log("errors", errors);

  return (
    <div className={classNames("form-field", className)}>
      {showErrors && errors && <FieldInfo errors={errors} />}
      <Input {...rest} hasError={errors.length > 0} />
    </div>
  );
}
