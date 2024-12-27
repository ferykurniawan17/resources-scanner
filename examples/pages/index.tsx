import React from "react";
import Banner from "../app/components/Banner";
import Header from "./components/Header";

function MainPage() {
  return (
    <div>
      <h1>{t("main.pageTitle")}</h1>
      <h1>{t("main.pageDescription")}</h1>
      <h1>{t("main.sectionTitle")}</h1>
      <Banner />
      <Header />
    </div>
  );
}

export default MainPage;
