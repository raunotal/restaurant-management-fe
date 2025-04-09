import classNames from "classnames";

type FormRowProps = {
  className?: string;
  children: React.ReactNode;
};

export default function FormRow({ className, children }: FormRowProps) {
  return (
    <div className={classNames("flex gap-8 mt-8", className)}>{children}</div>
  );
}
