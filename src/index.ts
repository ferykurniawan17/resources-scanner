import structureScanner from "./analyzeStructure";
import manageJson from "./jsonCreator";
import utils from "./utils";
import { Config } from "./type";

function execute(config: Config) {
  console.log("\x1b[33m%s\x1b[0m", "Start scanning project structure...");
  const { allPages, allGlobalFiles } = structureScanner.getStructure(config);

  console.log("\x1b[33m%s\x1b[0m", "Start combining keys...");
  const pageKeyMap = utils.combineKeys(allPages, allGlobalFiles);

  console.log("\x1b[33m%s\x1b[0m", "Start converting file paths to urls...");
  const pageUrlsKeysMap = structureScanner.convertFilePathsToUrls(
    pageKeyMap,
    config
  );

  console.log("\x1b[33m%s\x1b[0m", "Start creating json files...");
  manageJson.createJsonFiles(pageUrlsKeysMap, config);

  console.log("\x1b[32m%s\x1b[0m", "Finish creating json files...");
}

module.exports = execute;
