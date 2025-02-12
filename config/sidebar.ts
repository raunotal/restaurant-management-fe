import { IconType } from "./types";

type SidebarMenuItem = {
  label: string;
  href: string;
  iconType?: IconType;
};

export type SidebarMenu = {
  name?: string;
  items: SidebarMenuItem[];
  showLetter?: boolean;
};

export const SIDEBAR_NAVIGATION_MENU: SidebarMenu = {
  items: [
    {
      label: "Töölaud",
      href: "/",
      iconType: "home",
    },
    {
      label: "Retseptid",
      href: "/recipes",
      iconType: "recipes",
    },
    {
      label: "Toorained",
      href: "/ingredients",
      iconType: "ingredients",
    },
  ],
};

export const SIDEBAR_SETTINGS_MENU: SidebarMenu = {
  name: "Seaded",
  showLetter: true,
  items: [
    {
      label: "Tarnijad",
      href: "/suppliers",
    },
    {
      label: "Tooraine kategooriad",
      href: "/ingredient-categories",
    },
    {
      label: "Retsepti kategooriad",
      href: "/recipe-categories",
    },
    {
      label: "Ühikud",
      href: "/units",
    },
  ],
};
