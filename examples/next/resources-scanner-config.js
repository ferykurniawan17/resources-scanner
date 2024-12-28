module.exports = {
  folders: ["src/pages"],
  pageFileName: "index",
  whitelistGlobalFiles: [],
  exts: [".tsx", ".ts", ".js", ".jsx"],
  output: "generated",
  sourceFiles: {
    en: "sources/en.json",
    fr: "sources/fr.json",
    id: "sources/id.json",
  },
  alias: {
    "@/": "src/",
  },
  i18next: {
    list: ["t", "i18next.t", "i18n.t"],
  },
  hotReload: true,
};
