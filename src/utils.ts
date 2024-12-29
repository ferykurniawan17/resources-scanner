import fs from "fs";
// import _ from "lodash";
import path from "path";
import { Config, Ext, KeysFileMap, KeysMap, Storage } from "./type";

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

export function convertKeysFileMapToList(keysFileMap: KeysFileMap): Storage {
  let filePages: Record<string, Array<string>> = {};
  let pageKeys: Record<string, KeysMap> = {};

  [filePages, pageKeys] = Object.keys(keysFileMap).reduce(
    (acc, key) => {
      const files = keysFileMap[key].files as Array<string>;

      files.forEach((file) => {
        acc[0][file] = [...(acc[0][file] ?? []), key];
      });

      acc[1][key] = keysFileMap[key].keys as KeysMap;

      return acc;
    },
    [filePages, pageKeys]
  );

  return {
    filePages,
    pageKeys,
  };
}

function transformResourceGroupKey(pagePath: string, config: Config) {
  pagePath = pagePath.replace(/\.(tsx|js|jsx|ts|mjs)$/, "");

  // remove last section of the path if it is config.pageFileName
  const pagePathParts = pagePath.split("/");
  const lastPart = pagePathParts[pagePathParts.length - 1];

  if (config.pageFileName) {
    if (typeof config.pageFileName === "string") {
      if (lastPart === config.pageFileName) {
        pagePathParts.pop();
      }
    }
  }

  if (pagePathParts[pagePathParts.length - 1] === "index") pagePathParts.pop();

  pagePath = pagePathParts.join("/");
  return pagePath.replace(/\\/g, "/");
}

function convertSourceFilePathToUrl(pagePath: string, config: Config): string {
  const root = getRootProjectDir();
  let pageUrl = "";

  config.folders.forEach((folder: string) => {
    pagePath = pagePath.replace(`${root}/${folder}`, "");
  });

  if (config?.transformResourceGroupKey) {
    // remove first slash
    pagePath = pagePath.replace(/^\//, "");
    pageUrl = config.transformResourceGroupKey(pagePath);
    return `/${pageUrl}`;
  }

  return transformResourceGroupKey(pagePath, config);
}

function convertPageKeyMapToUrlKeyMap(
  allPages: Record<string, KeysMap>,
  config: Config
): Record<string, KeysMap> {
  const pageUrlsKeysMap = Object.keys(allPages).reduce(
    (acc: Record<string, KeysMap>, pagePath: string) => {
      const keys = allPages[pagePath];
      const pageUrl = convertSourceFilePathToUrl(pagePath, config);

      return {
        ...acc,
        [pageUrl]: {
          ...(acc[pageUrl] ?? {}),
          ...keys,
        },
      };
    },
    {}
  );

  return pageUrlsKeysMap;
}

function pathToOutputFiles(
  pagePath: string,
  config: Config
): Record<string, string> {
  let outputPath = convertSourceFilePathToUrl(pagePath, config);
  outputPath = `${config.output}${outputPath}`;

  const results = Object.keys(config.sourceFiles).reduce(
    (acc: Record<string, string>, lang) => {
      const filePath = `${outputPath}/${lang}.json`;
      acc[lang] = path.join(getRootProjectDir(), filePath);
      return acc;
    },
    {}
  );

  return results;
}

function getLocaleFromResourcePath(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1].replace(".json", "");
}

function getResourcesConfig(): Config {
  const rootDir = getRootProjectDir();
  const filePathConfig = path.resolve(rootDir, "resources-scanner-config.js");

  if (!isFileExist(filePathConfig)) {
    console.error("resources-scanner-config.js not found");
    return {
      folders: [],
      exts: [],
      sourceFiles: {},
      output: "",
      pageFileName: "",
      whitelistGlobalFiles: [],
      alias: {},
    };
  }

  const resourcesScannerConfig: Config = require(filePathConfig);

  return resourcesScannerConfig;
}

function getSourceLocales(): Array<string> {
  const rootDir = getRootProjectDir();
  const filePathConfig = path.resolve(rootDir, "resources-scanner-config.js");

  let resourcesScannerConfig: Config = {
    folders: [],
    exts: [],
    sourceFiles: {},
    output: "",
    pageFileName: "",
    whitelistGlobalFiles: [],
    alias: {},
  };
  if (!isFileExist(filePathConfig)) {
    return Object.keys(resourcesScannerConfig.sourceFiles);
  }

  resourcesScannerConfig = require(filePathConfig);
  return Object.keys(resourcesScannerConfig.sourceFiles);
}

// function jsonDiffKeys(
//   originalData: Record<string, any>,
//   newData: Record<string, any>
// ) {
//   const filtedKeys = _.filter(
//     _.keys(originalData),
//     (key) => !_.isEqual(originalData[key], newData[key])
//   );

//   return filtedKeys.reduce((acc: Record<string, any>, key) => {
//     acc[key] = newData[key];
//     return acc;
//   }, {});
// }

// const findOutputPathByKey = (
//   data: Record<string, KeysMap>,
//   targetKey: string
// ) => {
//   return _.filter(_.keys(data), (filePath) => _.has(data[filePath], targetKey));
// };

export default {
  isFileExist,
  isDirectory,
  getFileNameWithoutExt,
  getRootProjectDir,
  getExtentionFile,
  mergeKeys,
  combineKeys,
  convertKeysFileMapToList,
  transformResourceGroupKey,
  convertPageKeyMapToUrlKeyMap,
  convertSourceFilePathToUrl,
  pathToOutputFiles,
  getLocaleFromResourcePath,
  getResourcesConfig,
  getSourceLocales,
  // jsonDiffKeys,
  // findOutputPathByKey,
};
