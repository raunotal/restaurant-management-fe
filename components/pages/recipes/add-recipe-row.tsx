import classNames from "classnames";

type AddRecipeRowProps = {
  title?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export default function AddRecipeRow({
  title,
  contentClassName,
  children,
}: AddRecipeRowProps) {
  return (
    <div className="flex gap-8 mt-8">
      {title && <span className="font-semibold basis-1/3">{title}</span>}
      <div className={classNames("flex-auto flex gap-2", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
