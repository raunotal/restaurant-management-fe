import Image from "next/image";
import React from "react";
import logo from "@/public/logo.svg";
import NavLink from "../ui/nav-link";
import {
  SIDEBAR_NAVIGATION_MENU,
  SIDEBAR_SETTINGS_MENU,
  SidebarMenu,
} from "@/config/sidebar";
import classNames from "classnames";

function SidebarMenuSection(props: SidebarMenu) {
  const { items, name, showLetter } = props;
  return (
    <>
      {name && <div className="text-gray-400 text-xs">{name}</div>}
      <ul className={classNames("-m-2", name && "mt-2")}>
        {items.map((item, index) => (
          <li key={item.label + index}>
            <NavLink
              href={item.href}
              iconType={item.iconType}
              showLetter={showLetter}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Sidebar() {
  return (
    <div>
      <div className="flex flex-col px-6 h-full gap-5">
        <div className="flex items-center h-16">
          <Image src={logo} alt="Logo" />
        </div>
        <nav className="flex flex-col flex-1">
          <ul className="flex flex-col flex-1 gap-7 font-semibold">
            <li>
              <SidebarMenuSection {...SIDEBAR_NAVIGATION_MENU} />
            </li>
            <li>
              <SidebarMenuSection {...SIDEBAR_SETTINGS_MENU} />
            </li>
            <li className="mt-auto py-3">Sinu Nimi</li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
