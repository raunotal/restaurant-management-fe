import classNames from "classnames";

type ButtonProps = Omit<React.HTMLProps<HTMLButtonElement>, "type"> & {
  type?: "submit" | "reset" | "button";
  color?: "danger";
  isLoading?: boolean;
};

export default function Button(props: ButtonProps) {
  const { color, isLoading } = props;
  return (
    <button
      {...props}
      className={classNames(
        "text-white bg-indigo-600 font-semibold p-2.5 rounded-md text-sm w-[78px] h-[40px]",
        color === "danger" && "bg-red-500 hover:bg-red-600 text-white"
      )}
    >
      {isLoading ? <span className="loader" /> : props.children}
    </button>
  );
}
