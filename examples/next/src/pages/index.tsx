import Header from "@/components/Header";
import { t } from "@/utils";

export default function Home() {
  return (
    <>
      <Header />
      <h1>{t("main.pageTitle")}</h1>
      <h1>{t("main.subtitle")}</h1>
      <h1>{t("text.wording1")}</h1>
      <h1>{t("text.wording2")}</h1>
      <h1>{t("text.wording3")}</h1>
      <h1>{t("text.wording4")}</h1>
      <h1>{t("new.wording")}</h1>
      <h1>{t("new.wording2")}</h1>
    </>
  );
}
