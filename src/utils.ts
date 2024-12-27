import fs from "fs";
import path from "path";
import { Config, Ext, KeysFileMap, KeysMap } from "./type";

function isFileExist(filePath: string) {
  return fs.existsSync(filePath);
}

function isDirectory(filePath: string) {
  return fs.lstatSync(filePath).isDirectory();
}

function getFileNameWithoutExt(filePath: string) {
  const fileName = path.basename(filePath);
  return fileName.replace(path.extname(fileName), "");
}

function getRootProjectDir(): string {
  return process.cwd();
}

function getExtentionFile(path: string, config: Config) {
  let file = config.exts.find((ext: string) => {
    try {
      fs.accessSync(`${path}${ext}`);
      return true;
    } catch (e) {
      return false;
    }
  });

  if (file) return `${path}${file}`;

  file = config.exts.find((ext: Ext) => {
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

function mergeKeys(pagePath: string, allGlobalFiles: KeysFileMap) {
  const globalKeys = Object.keys(allGlobalFiles).reduce(
    (acc, globalFilePath) => {
      if (pagePath.includes(globalFilePath)) {
        return { ...acc, ...allGlobalFiles[globalFilePath].keys };
      }
      return acc;
    },
    {}
  );

  return globalKeys;
}

function combineKeys(
  allPages: KeysFileMap,
  allGlobalFiles: KeysFileMap
): Record<string, KeysMap> {
  const combinedKeys = Object.keys(allPages).reduce((acc, pagePath) => {
    const pageKeys: KeysMap = allPages[pagePath].keys as KeysMap;
    const globalKeys = mergeKeys(pagePath, allGlobalFiles);
    const keys = { ...pageKeys, ...globalKeys };
    return { ...acc, [pagePath]: keys };
  }, {});

  return combinedKeys;
}

export default {
  isFileExist,
  isDirectory,
  getFileNameWithoutExt,
  getRootProjectDir,
  getExtentionFile,
  mergeKeys,
  combineKeys,
};
