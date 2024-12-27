const filterRegex = [/components/, /tests/];

module.exports = {
  folders: ["examples/pages"],
  pageFileName: (path) => {
    const isFiltered = filterRegex.some((regex) => regex.test(path));
    return !isFiltered;
  },
  whitelistGlobalFiles: [],
  exts: [".js", ".tsx"],
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
