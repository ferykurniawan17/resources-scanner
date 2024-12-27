import fs from "fs";
import path from "path";
import utils from "./utils";
import { Files, KeysMap } from "./type";

function getExtentionFile(path: any, config: any) {
  let file = config.exts.find((ext: any) => {
    try {
      fs.accessSync(`${path}${ext}`);
      return true;
    } catch (e) {
      return false;
    }
  });

  if (file) return `${path}${file}`;

  file = config.exts.find((ext: any) => {
    try {
      fs.accessSync(`${path}/index${ext}`);
      return true;
    } catch (e) {
      return false;
    }
  });

  if (file) return `${path}/index${file}`;

  return null;
}

function extractFilePaths(code: any, locationFile: any, config: any) {
  // Regular expression untuk mencari import statement dan mengekstrak path file
  const regex = /from\s+['"]([^'"]+)['"]/g;
  // const regex =
  //   /import\s+([^\s]+(?:\s*,\s*[^\s]+)*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g;

  const filePaths: Array<string> = [];
  let match: any;

  const root = utils.getRootProjectDir();

  while ((match = regex.exec(code)) !== null) {
    const alias = Object.keys(config.alias).find((alias) =>
      match[1].startsWith(alias)
    );

    if (alias) {
      const path = match[1].replace(alias, config.alias[alias]);
      const withExtention = getExtentionFile(`${root}/${path}`, config);

      if (withExtention) filePaths.push(withExtention);
    } else {
      if (match[1].startsWith(".")) {
        const fullPath = path.resolve(path.dirname(locationFile), match[1]);

        const withExtention = getExtentionFile(fullPath, config);

        if (withExtention) filePaths.push(withExtention);
      }
    }
  }

  return filePaths;
}

function loadFileDependency(pathFile: any, paths: any, config: any): Files {
  const codeString = fs.readFileSync(pathFile, "utf-8");
  const filePaths = extractFilePaths(codeString, pathFile, config);

  filePaths.forEach((filePath) => {
    if (!paths.includes(filePath)) {
      paths.push(filePath);
      loadFileDependency(filePath, paths, config);
    }
  });

  return [...filePaths, ...paths];
}

export default loadFileDependency;
