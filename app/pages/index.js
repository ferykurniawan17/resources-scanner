import React from "react";
import Banner from "../components/Banner";

function MainPage() {
  return (
    <div>
      <h1>{t("main.pageTitle")}</h1>
      <Banner />
    </div>
  );
}

export default MainPage;
