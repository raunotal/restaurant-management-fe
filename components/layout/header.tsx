import React from "react";

interface HeaderProps {
  children: React.ReactNode;
}

export default function Header(props: HeaderProps) {
  const { children } = props;
  return (
    <div>
      <h2>{children}</h2>
    </div>
  );
}
