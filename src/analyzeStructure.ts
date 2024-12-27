import fs from "fs";
import path from "path";
import utils from "./utils";
import fileDependencies from "./fileDependencies";
import filesScanner from "./filesScanner";

function getStructure(config: any) {
  const rootProjectDir = utils.getRootProjectDir();

  const pageFileName = config.pageFileName;
  const whitelistGlobalFiles = config.whitelistGlobalFiles;
  const pagesGroupFolders = config.folders.map((folder: any) =>
    path.join(rootProjectDir, folder)
  );

  let allPages = {};
  let allGlobalFiles = {};

  function getPageFromFolder(
    pagesGroupFolders: any,
    currentPages = {},
    currentGlobalFiles = {},
    config: any
  ) {
    const files: any = fs.readdirSync(pagesGroupFolders);

    const { pageFiles, globalFiles, folders }: Record<string, any> =
      files.reduce(
        (acc: any, file: any) => {
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
              const files = [
                filePath,
                ...fileDependencies(filePath, [], config),
              ];
              acc.globalFiles = {
                ...acc.globalFiles,
                files,
                keys: filesScanner.scan(files, config),
              };
            }
          }

          return acc;
        },
        { pageFiles: {}, globalFiles: {}, folders: [] }
      );

    let newPages = { ...currentPages };
    let newGlobalFiles: any = { ...currentGlobalFiles };

    // if (pageFile) {
    //   newPages[pageFile] = pageFile;
    // }

    if (Object.keys(pageFiles).length) {
      newPages = pageFiles;
    }

    if (Object.keys(globalFiles).length) {
      newGlobalFiles[pagesGroupFolders] = globalFiles;
    }

    folders.forEach((folder: any) => {
      const [newPagesFromFolder, newGlobalFilesFromFolder] = getPageFromFolder(
        folder,
        newPages,
        newGlobalFiles,
        config
      );
      newPages = Object.assign(newPages, newPagesFromFolder);
      newGlobalFiles = Object.assign(newGlobalFiles, newGlobalFilesFromFolder);
    });

    return [newPages, newGlobalFiles];
  }

  pagesGroupFolders.forEach((pagesGroupFolder: any) => {
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

function mergeKeys(pagePath: any, allGlobalFiles: any) {
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

function combineKeys(allPages: any, allGlobalFiles: any) {
  const combinedKeys = Object.keys(allPages).reduce((acc, pagePath) => {
    const pageKeys = allPages[pagePath].keys;
    const globalKeys = mergeKeys(pagePath, allGlobalFiles);
    const keys = { ...pageKeys, ...globalKeys };
    return { ...acc, [pagePath]: keys };
  }, {});

  return combinedKeys;
}

function convertFilePathsToUrls(allPages: any, config: any) {
  const root = utils.getRootProjectDir();
  const pageUrlsKeysMap = Object.keys(allPages).reduce((acc: any, pagePath) => {
    const keys = allPages[pagePath];

    config.folders.forEach((folder: any) => {
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
  }, {});

  return pageUrlsKeysMap;
}

export default {
  getStructure,
  combineKeys,
  convertFilePathsToUrls,
};
