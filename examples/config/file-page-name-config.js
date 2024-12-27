module.exports = {
  folders: ["examples/pages"],
  whitelistGlobalFiles: [],
  exts: [".tsx", ".js"],
  output: "generated",
  sourceFiles: {
    en: "examples/app/sources/en.json",
    fr: "examples/app/sources/fr.json",
    id: "examples/app/sources/id.json",
  },
  alias: {},
  i18next: {
    list: ["t", "i18next.t", "i18n.t"],
  },
};
