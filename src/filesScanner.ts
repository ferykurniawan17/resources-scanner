import fs from "fs";
// @ts-ignore
import { Parser } from "i18next-scanner";
import { Config } from "./type";

export function scanFileResources(pathFile: string, config: Config) {
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
        (key: string, options: any) => {
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

export function scan(files: Array<string>, config: Config) {
  const keys = {};
  files.forEach((file: string) => {
    const fileKeys = scanFileResources(file, config);
    Object.assign(keys, fileKeys);
  });

  return keys;
}
