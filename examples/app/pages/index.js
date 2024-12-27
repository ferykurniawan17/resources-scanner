import React from "react";
import Banner from "../components/Banner";
import Layout from "./layout";

function MainPage() {
  return (
    <Layout>
      <h1>{t("main.pageTitle")}</h1>
      <h1>{t("main.pageDescription")}</h1>
      <h1>{t("main.sectionTitle")}</h1>
      <Banner />
    </Layout>
  );
}

export default MainPage;
