module.exports = {
  folders: ["examples/app/pages"],
  pageFileName: "index",
  whitelistGlobalFiles: [],
  exts: [".js"],
  output: "generated",
  sourceFiles: {
    en: "examples/app/sources/en.json",
    fr: "examples/app/sources/fr.json",
    id: "examples/app/sources/id.json",
  },
  alias: {},
  i18next: {
    transform: function (parser, content) {
      parser
        .parseFuncFromString(
          content,
          {
            list: ["t", "i18next.t", "i18n.t"],
          },
          (key, options) => {
            parser.set(key, {
              ...options,
              nsSeparator: false,
              keySeparator: false,
              defaultNs: "",
            });
          }
        )
        .parseFuncFromString(content);

      const result = parser.get();

      if (result.en && result.en.translation) {
        return result.en.translation;
      }

      return {};
    },
  },
};
