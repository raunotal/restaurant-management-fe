import Image from "next/image";
import React from "react";
import logo from "@/public/logo.svg";
import NavLink from "../ui/nav-link";

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
              <ul className="-m-2">
                <li>
                  <NavLink href="/" iconType="home">
                    Töölaud
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <div className="text-gray-400 text-xs">Seaded</div>
              <ul className="-m-2 mt-2">
                <li>
                  <NavLink href="/units" showLetter>
                    Ühikud
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="mt-auto py-3">Sinu Nimi</li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
