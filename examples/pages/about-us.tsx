import React from "react";
import Banner from "../app/components/Banner";

function AboutPage() {
  return (
    <div>
      <h1>{t("about.pageTitle")}</h1>
      <Banner />
    </div>
  );
}

export default AboutPage;
