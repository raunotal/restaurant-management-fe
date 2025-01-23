import { IconType } from "@/config/types";
import Link from "next/link";
import Icon from "./icons/icon";

interface NavLinkProps {
  href: string;
  iconType?: IconType;
  showLetter?: boolean;
  children: React.ReactNode;
}

export default function NavLink(props: NavLinkProps) {
  const { href, iconType, showLetter, children } = props;
  return (
    <Link
      href={href}
      className="flex gap-3 items-center text-gray-700 rounded-md font-semibold text-sm p-2 hover:text-indigo-600 hover:bg-gray-50 group"
    >
      {showLetter && (
        <span className="font-medium text-gray-400 group-hover:text-indigo-600 text-xs bg-white border border-gray-200 group-hover:border-indigo-600 rounded-lg w-6 h-6 flex items-center justify-center leading-6">
          {children!.toString().charAt(0)}
        </span>
      )}
      {iconType && <Icon type={iconType} />}
      {children}
    </Link>
  );
}
