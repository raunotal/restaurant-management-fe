import classNames from "classnames";

type FormRowProps = {
  title?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export default function FormRow({
  title,
  contentClassName,
  children,
}: FormRowProps) {
  return (
    <div className="flex gap-8 mt-8">
      {title && <span className="font-semibold basis-1/3">{title}</span>}
      <div className={classNames("basis-2/3 flex gap-2", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
