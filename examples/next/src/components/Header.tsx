import { t } from "@/utils";
import React from "react";

const Header = () => {
  return (
    <header>
      <h1>Header</h1>
      <h1>{t("header.wording3")}</h1>
      <h1>{t("header.wording4")}</h1>
      <h1>{t("header.wording")}</h1>
    </header>
  );
};

export default Header;
