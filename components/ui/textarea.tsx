import {
  Label,
  Description,
  Field,
  Textarea as TextareaComponent,
} from "@headlessui/react";
import classNames from "classnames";

export interface TextareaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  description?: string;
  hasError?: boolean;
  isField?: boolean;
  label?: string;
  name: string;
  textareaClassName?: string;
}

export default function Textarea(props: TextareaProps) {
  const {
    description,
    label,
    isField = true,
    hasError,
    className,
    textareaClassName,
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
      <TextareaComponent
        className={classNames(
          "py-1.5 px-3  text-sm outline-gray-300 -outline-offset-1 outline-1 outline-solid focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 text-gray-900 py-1.5 px3 bg-white rounded-md w-full placeholder:text-gray-400",
          isField && "mt-2",
          hasError && "outline-red-500",
          textareaClassName
        )}
        style={{ outlineStyle: "solid" }}
        {...rest}
      />
    </Field>
  );
}
