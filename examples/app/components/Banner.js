import useText, { useText2 } from "../hooks/useText";

export default function Banner() {
  const texts = useText();
  const texts2 = useText2();
  return (
    <div>
      <h1>{t("component.title")}</h1>
      <h1>{t("component.description")}</h1>
      <h1>{texts.wording1}</h1>
      <h1>{texts.wording2}</h1>
      <h1>{texts.wording3}</h1>
      <h1>{texts.wording4}</h1>
      <h1>{texts2.text1}</h1>
      <h1>{texts2.text2}</h1>
      <h1>{texts2.text3}</h1>
      <h1>{texts2.text4}</h1>
    </div>
  );
}
