import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <h1>{t("template.title")}</h1>
      {children}
    </div>
  );
};

export default Layout;
