import path from "path";
import { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import utils from "../utils";
import jsonCreator from "../jsonCreator";
import { Config } from "../type";
import { collector } from "../tasks";
import JsonWatcher from "./JsonWatcher";

export default function withResourcesScanner(customConfig: NextConfig) {
  return (phase: string, { defaultConfig }: { defaultConfig: NextConfig }) => {
    const rootDir = utils.getRootProjectDir();
    const filePathConfig = path.resolve(rootDir, "resources-scanner-config.js");

    // check if config file exists
    if (!utils.isFileExist(filePathConfig)) {
      console.error("resources-scanner-config.js not found");
      return {
        ...defaultConfig,
        ...customConfig,
      };
    }

    // Load config file
    const resourcesScannerConfig: Config = require(filePathConfig);
    const { pageUrlsKeysMap, storages } = collector(resourcesScannerConfig);

    jsonCreator.createJsonFiles(pageUrlsKeysMap, resourcesScannerConfig);

    console.log(
      "\x1b[34m%s\x1b[0m",
      "resources-scanner: Finish creating json files..."
    );

    if (
      phase === PHASE_DEVELOPMENT_SERVER &&
      resourcesScannerConfig.hotReload
    ) {
      const watcherInstance = new JsonWatcher(storages, resourcesScannerConfig);
      watcherInstance.watch();
    }

    return {
      ...defaultConfig,
      ...customConfig,
    };
  };
}
