// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Parser = require("i18next-scanner").Parser;

function scan(pathFile, config) {
  const parser = new Parser();
  const content = fs.readFileSync(pathFile, "utf-8");

  if (config?.i18next?.transform) {
    const res = config?.i18next?.transform(parser, content);
    if (res) return res;
  } else {
    parser
      .parseFuncFromString(
        content,
        {
          list: config?.i18next?.list ?? ["t", "i18next.t", "i18n.t"],
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
  }

  return {};
}

module.exports = { scan };
