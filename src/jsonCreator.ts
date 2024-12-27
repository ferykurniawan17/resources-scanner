import fs from "fs";
import path from "path";
import utils from "./utils";

function createJsonFiles(urlsKeysMap: any, config: any) {
  const rootProjectDir = utils.getRootProjectDir();

  config.sourceFiles = config.sourceFiles || {};

  // load existing json files
  const existingJsonFiles = Object.keys(config.sourceFiles).reduce(
    (acc: any, key) => {
      const filePath = path.join(rootProjectDir, config.sourceFiles[key]);
      if (fs.existsSync(filePath)) {
        acc[key] = JSON.parse(fs.readFileSync(filePath, "utf8"));
      }
      return acc;
    },
    {}
  );

  // create json files for each map keys
  Object.keys(urlsKeysMap).forEach((url) => {
    const keys = urlsKeysMap[url];

    Object.keys(config.sourceFiles).forEach((locale) => {
      const existingKeys = existingJsonFiles[locale] || {};

      const json = Object.keys(keys).reduce((acc: any, key) => {
        acc[key] = existingKeys[key] || key;
        return acc;
      }, {});

      const fileCreated = `${rootProjectDir}/${config.output}${url}/${locale}.json`;

      // create json file
      // create folder if not exists
      const folderPath = path.dirname(fileCreated);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      fs.writeFileSync(fileCreated, JSON.stringify(json, null, 2));
    });
  });
}

export default {
  createJsonFiles,
};
