import fs from "fs";
// @ts-ignore
import { Parser } from "i18next-scanner";

function filelScan(pathFile: any, config: any) {
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
        (key: any, options: any) => {
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

function scan(files: any, config: any) {
  const keys = {};
  files.forEach((file: any) => {
    const fileKeys = filelScan(file, config);
    Object.assign(keys, fileKeys);
  });

  return keys;
}

export default { scan };
