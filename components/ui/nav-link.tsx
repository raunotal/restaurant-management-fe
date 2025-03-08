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
      className="flex gap-x-3 text-gray-700 rounded-md font-semibold text-sm p-2 hover:text-indigo-600 hover:bg-gray-50 group leading-6 items-center"
    >
      {showLetter && (
        <span className="text-gray-400 group-hover:text-indigo-600 bg-white border border-gray-200 group-hover:border-indigo-600 rounded-lg w-6 h-6 flex items-center justify-center">
          <span className="font-medium text-xs">
            {children!.toString().charAt(0)}
          </span>
        </span>
      )}
      {iconType && <Icon type={iconType} />}
      <span className="flex h-5">{children}</span>
    </Link>
  );
}
