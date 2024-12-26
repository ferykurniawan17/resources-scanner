// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fileDependencies = require("./fileDependencies");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const filesScanner = require("./filesScanner");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const utils = require("./utils");

function getStructure(config) {
  const rootProjectDir = utils.getRootProjectDir();

  const pageFileName = config.pageFileName;
  const whitelistGlobalFiles = config.whitelistGlobalFiles;
  const pagesGroupFolders = config.folders.map((folder) =>
    path.join(rootProjectDir, folder)
  );

  let allPages = {};
  let allGlobalFiles = {};

  function getPageFromFolder(
    pagesGroupFolders,
    currentPages = {},
    currentGlobalFiles = {},
    config
  ) {
    const files = fs.readdirSync(pagesGroupFolders);

    const { pageFiles, globalFiles, folders } = files.reduce(
      (acc, file) => {
        const filePath = path.join(pagesGroupFolders, file);
        const fileWithoutExt = utils.getFileNameWithoutExt(filePath);
        const isWhitelistedFile = pageFileName === fileWithoutExt;
        const isWhitelistedGroupFile =
          whitelistGlobalFiles.includes(fileWithoutExt);
        const isDirectory = utils.isDirectory(filePath);

        if (isWhitelistedFile && !isDirectory) {
          const files = [filePath, ...fileDependencies(filePath, [], config)];

          acc.pageFiles = {
            ...acc.pageFiles,
            [filePath]: {
              files,
              keys: filesScanner.scan(files, config),
            },
          };
        } else if (isWhitelistedGroupFile) {
          const files = [filePath, ...fileDependencies(filePath, [], config)];
          acc.globalFiles = {
            ...acc.globalFiles,
            files,
            keys: filesScanner.scan(files, config),
          };
        } else {
          if (isDirectory) acc.folders.push(filePath);
        }

        return acc;
      },
      { pageFiles: {}, globalFiles: {}, folders: [] }
    );

    let newPages = { ...currentPages };
    let newGlobalFiles = { ...currentGlobalFiles };

    // if (pageFile) {
    //   newPages[pageFile] = pageFile;
    // }

    if (Object.keys(pageFiles).length) {
      newPages = pageFiles;
    }

    if (Object.keys(globalFiles).length) {
      newGlobalFiles[pagesGroupFolders] = globalFiles;
    }

    folders.forEach((folder) => {
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

  pagesGroupFolders.forEach((pagesGroupFolder) => {
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

function mergeKeys(pagePath, allGlobalFiles) {
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

function combineKeys(allPages, allGlobalFiles) {
  const combinedKeys = Object.keys(allPages).reduce((acc, pagePath) => {
    const pageKeys = allPages[pagePath].keys;
    const globalKeys = mergeKeys(pagePath, allGlobalFiles);
    const keys = { ...pageKeys, ...globalKeys };
    return { ...acc, [pagePath]: keys };
  }, {});

  return combinedKeys;
}

function convertFilePathsToUrls(allPages, config) {
  const root = utils.getRootProjectDir();
  const pageUrlsKeysMap = Object.keys(allPages).reduce((acc, pagePath) => {
    const keys = allPages[pagePath];

    config.folders.forEach((folder) => {
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
      if (lastPart === config.pageFileName) {
        pagePathParts.pop();
      }

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

module.exports = {
  getStructure,
  combineKeys,
  convertFilePathsToUrls,
};
