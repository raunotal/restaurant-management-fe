interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button(props: ButtonProps) {
  const { onClick, children } = props;

  return (
    <button
      className="text-white bg-indigo-600 font-semibold p-2.5 rounded-md text-sm"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
