// eslint-disable-next-line @typescript-eslint/no-var-requires
const structureScanner = require("./analyzeStructure");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const manageJson = require("./jsonCreator");

function execute(config) {
  console.log("Start scanning project structure...");
  const { allPages, allGlobalFiles } = structureScanner.getStructure(config);

  console.log("Start creating json files...");
  const pageKeyMap = structureScanner.combineKeys(
    allPages,
    allGlobalFiles,
    config
  );

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
