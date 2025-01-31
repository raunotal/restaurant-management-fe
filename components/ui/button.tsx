import classNames from "classnames";

type ButtonProps = Omit<React.HTMLProps<HTMLButtonElement>, "type"> & {
  type?: "submit" | "reset" | "button";
  color?: "danger";
};

export default function Button(props: ButtonProps) {
  const { color } = props;
  return (
    <button
      {...props}
      className={classNames(
        "text-white bg-indigo-600 font-semibold p-2.5 rounded-md text-sm",
        color === "danger" && "bg-red-500 hover:bg-red-600 text-white"
      )}
    >
      {props.children}
    </button>
  );
}
