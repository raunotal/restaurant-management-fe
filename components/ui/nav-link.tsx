import classNames from "classnames";
import Link from "next/link";

interface NavLinkProps {
  active?: boolean;
  href: string;
  children: React.ReactNode;
}

export default function NavLink(props: NavLinkProps) {
  const { active, href, children } = props;
  return (
    <Link href={href} className={classNames("button", { "button--dark": active })}>
      {children}
    </Link>
  );
}
