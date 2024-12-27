import structureScanner from "./analyzeStructure";
import manageJson from "./jsonCreator";
import { Config } from "./type";

function execute(config: Config) {
  console.log("====================================");
  console.log("Start scanning project structure...");
  const { allPages, allGlobalFiles } = structureScanner.getStructure(config);

  console.log("Start creating json files...");
  const pageKeyMap = structureScanner.combineKeys(allPages, allGlobalFiles);

  console.log("Start creating json files...");
  const pageUrlsKeysMap = structureScanner.convertFilePathsToUrls(
    pageKeyMap,
    config
  );

  console.log("Start creating json files...");
  manageJson.createJsonFiles(pageUrlsKeysMap, config);

  console.log("Finish creating json files...");
  console.log("Resources created", Object.keys(pageUrlsKeysMap));
}

module.exports = execute;
