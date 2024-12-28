import analyzeStructure from "./analyzeStructure";
import { Config, KeysMap, Storage } from "./type";
import utils from "./utils";

export function collector(config: Config): {
  pageUrlsKeysMap: Record<string, KeysMap>;
  storages: Storage;
} {
  // console.log("\x1b[33m%s\x1b[0m", "Start scanning project structure...");
  const { allPages, allGlobalFiles, storages } =
    analyzeStructure.getStructure(config);

  // console.log("\x1b[33m%s\x1b[0m", "Start combining keys...");
  const pageKeyMap = utils.combineKeys(allPages, allGlobalFiles);

  // console.log("\x1b[33m%s\x1b[0m", "Start converting file paths to urls...");
  const pageUrlsKeysMap = analyzeStructure.convertFilePathsToUrls(
    pageKeyMap,
    config
  );

  return {
    pageUrlsKeysMap,
    storages,
  };
}
