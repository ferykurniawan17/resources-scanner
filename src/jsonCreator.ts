import fs from "fs";
import path from "path";
import utils from "./utils";
import { Config, KeysMap } from "./type";

function getExistingJsonFiles(config: Config) {
  const rootProjectDir = utils.getRootProjectDir();

  config.sourceFiles = config.sourceFiles || {};

  // load existing json files
  return Object.keys(config.sourceFiles).reduce(
    (acc: Record<string, KeysMap>, key) => {
      const filePath = path.join(rootProjectDir, config.sourceFiles[key]);
      if (fs.existsSync(filePath)) {
        try {
          const messages = fs.readFileSync(filePath, "utf8");
          acc[key] = JSON.parse(messages);
        } catch (e) {
          console.log("\x1b[31m%s\x1b[0m", "Failed Load JSON File:", filePath);
          console.log("\x1b[31m%s\x1b[0m", e);

          process.exit(1);
        }
      }
      return acc;
    },
    {}
  );
}

function updateJsonFiles(
  filePaths: Array<string>,
  newResources: Record<string, string>,
  config: Config
) {
  // load existing json files
  const existingJsonFiles = getExistingJsonFiles(config);

  filePaths.forEach((file) => {
    // read file
    try {
      const messages = fs.readFileSync(file, "utf8");
      const json = JSON.parse(messages);
      const lang = utils.getLocaleFromResourcePath(file);

      newResources = Object.keys(newResources).reduce((acc, key) => {
        acc[key] = existingJsonFiles[lang][key] || key;
        return acc;
      }, json);

      // overwrite file
      fs.writeFileSync(file, JSON.stringify(newResources, null, 2));
    } catch (e) {
      // yellow color
      console.log("\x1b[33m%s\x1b[0m", "Failed Load JSON File:", file);
    }
  });
}

function createJsonFiles(urlsKeysMap: Record<string, KeysMap>, config: Config) {
  const rootProjectDir = utils.getRootProjectDir();

  config.sourceFiles = config.sourceFiles || {};

  // load existing json files
  const existingJsonFiles = getExistingJsonFiles(config);

  // create json files for each map keys
  Object.keys(urlsKeysMap).forEach((url) => {
    const keys = urlsKeysMap[url];

    Object.keys(config.sourceFiles).forEach((locale) => {
      const existingKeys = existingJsonFiles[locale] || {};

      const json = Object.keys(keys).reduce((acc: KeysMap, key) => {
        acc[key] = existingKeys[key] || key;
        return acc;
      }, {});

      const outputFile = `${config.output}${url}/${locale}.json`;
      const fileCreated = `${rootProjectDir}/${outputFile}`;

      const folderPath = path.dirname(fileCreated);

      if (!fs.existsSync(folderPath)) {
        try {
          fs.mkdirSync(folderPath, { recursive: true });
        } catch (e) {
          console.log(
            "\x1b[31m%s\x1b[0m",
            "Failed Creation Folder:",
            folderPath
          );
          console.log("\x1b[31m%s\x1b[0m", e);

          process.exit(1);
        }
      }

      try {
        fs.writeFileSync(fileCreated, JSON.stringify(json, null, 2));
      } catch (e) {
        console.log(
          "\x1b[31m%s\x1b[0m",
          "Failed Creation JSON File:",
          outputFile
        );
        console.log("\x1b[31m%s\x1b[0m", e);

        process.exit(1);
      }
    });
  });
}

export default {
  createJsonFiles,
  updateJsonFiles,
};
