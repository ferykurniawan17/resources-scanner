import jsonCreator from "./jsonCreator";
import { Config } from "./type";
import { collector } from "./tasks";

function execute(config: Config) {
  const { pageUrlsKeysMap } = collector(config);

  console.log("\x1b[33m%s\x1b[0m", "Start creating json files...");
  jsonCreator.createJsonFiles(pageUrlsKeysMap, config);

  console.log("\x1b[32m%s\x1b[0m", "Finish creating json files...");
}

module.exports = execute;
