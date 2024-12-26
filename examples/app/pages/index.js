import React from "react";
import Banner from "../components/Banner";

function MainPage() {
  return (
    <div>
      <h1>{t("main.pageTitle")}</h1>
      <h1>{t("main.pageDescription")}</h1>
      <h1>{t("main.sectionTitle")}</h1>
      <Banner />
    </div>
  );
}

export default MainPage;
