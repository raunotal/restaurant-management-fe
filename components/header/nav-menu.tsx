"use client";

import { usePathname } from "next/navigation";
import NavLink from "../ui/nav-link";

export default function NavMenu() {
  const pathname = usePathname();
  console.log("pathname", pathname);

  return (
    <nav>
      <NavLink href="/recipes" active={pathname === "/recipes"}>
        Retseptid
      </NavLink>
    </nav>
  );
}
