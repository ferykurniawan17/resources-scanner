// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Parser = require("i18next-scanner").Parser;

function scan(pathFile) {
  const parser = new Parser();
  const content = fs.readFileSync(pathFile, "utf-8");

  parser
    .parseFuncFromString(
      content,
      {
        list: ["Localizer.t", "t"],
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
}

module.exports = { scan };
