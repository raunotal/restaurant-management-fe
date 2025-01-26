import {
  Label,
  Description,
  Field,
  Input as InputComponent,
} from "@headlessui/react";

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  description?: string;
  label: string;
  name: string;
}

export default function Input(props: InputProps) {
  const { description, label, className } = props;

  return (
    <Field className={className}>
      <Label className="text-gary-900 font-medium text-sm">{label}</Label>
      <Description>{description}</Description>
      <InputComponent
        className="py-1.5 px-3 mt-2 text-sm outline-gray-300 -outline-offset-1 outline-1 outline-solid focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 text-gray-900 py-1.5 px3 bg-white rounded-md w-full placeholder:text-gray-400"
        style={{ outlineStyle: "solid" }}
        {...props}
      />
    </Field>
  );
}
