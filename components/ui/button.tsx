import classNames from "classnames";

type ButtonProps = Omit<React.HTMLProps<HTMLButtonElement>, "type"> & {
  type?: "submit" | "reset" | "button";
  color?: "danger";
  isLoading?: boolean;
};

export default function Button(props: ButtonProps) {
  const { disabled, color, isLoading, ...rest } = props;
  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={classNames(
        "text-white bg-indigo-600 font-semibold p-2.5 rounded-md text-sm w-[78px] h-[40px]",
        color === "danger" && "bg-red-500 hover:bg-red-600 text-white",
        disabled && "!bg-gray-300"
      )}
    >
      {isLoading ? <span className="loader" /> : props.children}
    </button>
  );
}
