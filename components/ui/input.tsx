import {
  Label,
  Description,
  Field,
  Input as InputComponent,
} from "@headlessui/react";
import classNames from "classnames";

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  description?: string;
  hasError?: boolean;
  isField?: boolean;
  label?: string;
  name?: string;
}

export default function Input(props: InputProps) {
  const {
    description,
    label,
    isField = true,
    hasError,
    className,
    ...rest
  } = props;

  return (
    <Field className={classNames(isField && "mt-4", className)}>
      {label && (
        <Label className="text-gary-900 font-medium text-sm">{label}</Label>
      )}
      {description && (
        <Description className="text-xs">{description}</Description>
      )}
      <InputComponent
        className={classNames(
          "py-1.5 px-3  text-sm outline-gray-300 -outline-offset-1 outline-1 outline-solid focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 text-gray-900 py-1.5 px3 bg-white rounded-md w-full placeholder:text-gray-400",
          isField && "mt-2",
          hasError && "outline-red-500"
        )}
        style={{ outlineStyle: "solid" }}
        {...rest}
      />
    </Field>
  );
}
