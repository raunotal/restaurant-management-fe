import React from "react";
import NavMenu from "./nav-menu";
import Icon from "../ui/icon";

const Header = () => {
  return (
    <header>
      <NavMenu />
      <Icon type="gear" />
    </header>
  );
};

export default Header;
