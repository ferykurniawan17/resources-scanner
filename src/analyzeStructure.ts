import fs from "fs";
import path from "path";
import utils from "./utils";
import fileDependencies from "./fileDependencies";
import filesScanner from "./filesScanner";
import { Config, Files, KeysFileMap, KeysMap } from "./type";

type Structure = {
  allPages: KeysFileMap;
  allGlobalFiles: KeysFileMap;
};

type ResFolder = {
  folders: Array<string>;
  pageFiles: KeysFileMap;
  globalFiles: KeysFileMap;
};

function getStructure(config: Config): Structure {
  const rootProjectDir = utils.getRootProjectDir();

  const pageFileName = config.pageFileName;
  const whitelistGlobalFiles = config.whitelistGlobalFiles;
  const pagesGroupFolders = config.folders.map((folder: string) =>
    path.join(rootProjectDir, folder)
  );

  let allPages: KeysFileMap = {};
  let allGlobalFiles: KeysFileMap = {};

  function getPageFromFolder(
    pagesGroupFolders: string,
    currentPages: KeysFileMap = {},
    currentGlobalFiles: KeysFileMap = {},
    config: Config
  ): [newPages: KeysFileMap, newGlobalFiles: KeysFileMap] {
    const files: Files = fs.readdirSync(pagesGroupFolders);

    const { pageFiles, globalFiles, folders }: ResFolder = files.reduce(
      (acc: ResFolder, file: string) => {
        const filePath = path.join(pagesGroupFolders, file);
        const isDirectory = utils.isDirectory(filePath);

        if (isDirectory) {
          acc.folders.push(filePath);
        } else {
          const fileWithoutExt = utils.getFileNameWithoutExt(filePath);
          const isWhitelistedFile =
            pageFileName && typeof pageFileName === "string"
              ? pageFileName === fileWithoutExt
              : true;
          const isWhitelistedGroupFile =
            whitelistGlobalFiles.includes(fileWithoutExt);

          if (isWhitelistedFile) {
            let isNeedToInclude = true;
            if (typeof config.pageFileName === "function") {
              isNeedToInclude = config.pageFileName(
                filePath.replace(rootProjectDir, "")
              );
            }

            if (isNeedToInclude) {
              const files = [
                filePath,
                ...fileDependencies(filePath, [], config),
              ];
              acc.pageFiles = {
                ...acc.pageFiles,
                [filePath]: {
                  files,
                  keys: filesScanner.scan(files, config),
                },
              };
            }
          } else if (isWhitelistedGroupFile) {
            const files = [filePath, ...fileDependencies(filePath, [], config)];

            acc.globalFiles[pagesGroupFolders] = {
              ...(acc.globalFiles[pagesGroupFolders] ?? {}),
              files: [
                ...(acc.globalFiles[pagesGroupFolders]?.files ?? []),
                ...files,
              ],
              keys: {
                ...(currentGlobalFiles[pagesGroupFolders]?.keys ?? {}),
                ...filesScanner.scan(files, config),
              },
            };
          }
        }

        return acc;
      },
      { pageFiles: currentPages, globalFiles: currentGlobalFiles, folders: [] }
    );

    let newPages: KeysFileMap = { ...currentPages };
    let newGlobalFiles: KeysFileMap = { ...currentGlobalFiles };

    if (Object.keys(pageFiles).length) {
      newPages = pageFiles;
    }

    folders.forEach((folder: string) => {
      const [newPagesFromFolder, newGlobalFilesFromFolder] = getPageFromFolder(
        folder,
        newPages,
        globalFiles,
        config
      );
      newPages = Object.assign(newPages, newPagesFromFolder);
      newGlobalFiles = Object.assign(newGlobalFiles, newGlobalFilesFromFolder);
    });

    return [newPages, newGlobalFiles];
  }

  pagesGroupFolders.forEach((pagesGroupFolder: string) => {
    const [pages, globalFiles] = getPageFromFolder(
      pagesGroupFolder,
      allPages,
      allGlobalFiles,
      config
    );

    allPages = Object.assign(allPages, pages);
    allGlobalFiles = Object.assign(allGlobalFiles, globalFiles);
  });

  return { allPages, allGlobalFiles };
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

function convertFilePathsToUrls(
  allPages: Record<string, KeysMap>,
  config: Config
) {
  const root = utils.getRootProjectDir();
  const pageUrlsKeysMap = Object.keys(allPages).reduce(
    (acc: Record<string, KeysMap>, pagePath: string) => {
      const keys = allPages[pagePath];

      config.folders.forEach((folder: string) => {
        pagePath = pagePath.replace(`${root}/${folder}`, "");
      });

      let pageUrl = "";
      if (config?.transformResourceGroupKey) {
        // remove first slash
        pagePath = pagePath.replace(/^\//, "");
        pageUrl = config.transformResourceGroupKey(pagePath);
        pageUrl = `/${pageUrl}`;
      } else {
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

        if (pagePathParts[pagePathParts.length - 1] === "index")
          pagePathParts.pop();

        pagePath = pagePathParts.join("/");
        pageUrl = pagePath.replace(/\\/g, "/");
      }
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

export default {
  getStructure,
  combineKeys,
  convertFilePathsToUrls,
};
