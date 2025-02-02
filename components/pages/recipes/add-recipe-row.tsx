type AddRecipeRowProps = {
  title?: string;
  children: React.ReactNode;
};

export default function AddRecipeRow({ title, children }: AddRecipeRowProps) {
  return (
    <div className="flex gap-8 mt-8">
      {title && <span className="font-semibold basis-1/3">{title}</span>}
      <div className="flex-auto flex gap-2">{children}</div>
    </div>
  );
}
