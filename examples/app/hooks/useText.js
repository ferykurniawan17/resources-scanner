import { t } from "../resourceFn";

export function useText2() {
  return {
    text1: t("text.text1"),
    text2: t("text.text2"),
    text3: t("text.text3"),
    text4: t("text.text4"),
  };
}

export default function useText() {
  return {
    wording1: t("text.wording1"),
    wording2: t("text.wording2"),
    wording3: t("text.wording3"),
    wording4: t("text.wording4"),
  };
}
