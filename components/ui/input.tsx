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
  description: string;
  label: string;
  hasError?: boolean;
}

export default function Input(props: InputProps) {
  const { description, label } = props;

  return (
    <Field disabled>
      <Label className="data-[disabled]:opacity-50">{label}</Label>
      <Description className="data-[disabled]:opacity-50">
        {description}
      </Description>
      <InputComponent
        name="full_name"
        className="data-[disabled]:bg-gray-100"
      />
    </Field>
  );
}
