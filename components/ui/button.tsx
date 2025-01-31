type ButtonProps = Omit<React.HTMLProps<HTMLButtonElement>, "type"> & {
  type?: "submit" | "reset" | "button";
};

export default function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className="text-white bg-indigo-600 font-semibold p-2.5 rounded-md text-sm"
    >
      {props.children}
    </button>
  );
}
