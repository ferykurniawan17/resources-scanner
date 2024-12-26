module.exports = {
  folders: ["app"],
  pageFileName: "index",
  whitelistGlobalFiles: [],
  exts: [".js"],
  output: "generated",
  sourceFiles: {
    en: "app/sources/en.json",
    fr: "app/sources/fr.json",
    id: "app/sources/id.json",
  },
  alias: {},
  i18next: {
    list: ["t", "i18next.t", "i18n.t"],
  },
};
