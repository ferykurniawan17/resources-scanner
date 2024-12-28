import fs from "fs";
import path from "path";
import utils from "./utils";
import fileDependencies from "./fileDependencies";
import { scan } from "./filesScanner";
import { Config, Files, KeysFileMap, KeysMap, Storage } from "./type";

type Structure = {
  allPages: KeysFileMap;
  allGlobalFiles: KeysFileMap;
  storages: Storage;
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
                  keys: scan(files, config),
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
                ...scan(files, config),
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

  const storages: Storage = utils.convertKeysFileMapToList(allPages);

  return { allPages, allGlobalFiles, storages };
}

function convertFilePathsToUrls(
  allPages: Record<string, KeysMap>,
  config: Config
): Record<string, KeysMap> {
  const pageUrlsKeysMap = Object.keys(allPages).reduce(
    (acc: Record<string, KeysMap>, pagePath: string) => {
      const keys = allPages[pagePath];
      const pageUrl = utils.convertSourceFilePathToUrl(pagePath, config);

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
  convertFilePathsToUrls,
};
