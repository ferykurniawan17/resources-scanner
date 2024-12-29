import chokidar from "chokidar";
import path from "path";
// import _ from "lodash";
import { scan } from "../filesScanner";
import { Config, Storage } from "../type";
import utils from "../utils";
import jsonCreator from "../jsonCreator";
import loadFileDependency from "../fileDependencies";

import type { SourceFiles } from "../type";

class JsonWatcher {
  private storages: Storage = {
    filePages: {},
    pageKeys: {},
  };

  private config: Partial<Config> = {};

  private rootDir: string = utils.getRootProjectDir();

  // private watcher: any;
  private sourceWatcher: any;

  // private originalSourcesData: Record<string, Record<string, any>> = {};

  constructor(storages: Storage, config: Config) {
    this.storages = storages;
    this.config = config;

    // this.originalSourcesData = jsonCreator.getExistingJsonFiles(config);
  }

  // private includesSourceFiles(filePath: string): boolean {
  //   const sourceFiles = Object.values(this.config.sourceFiles as SourceFiles);
  //   return sourceFiles.some((file) => filePath.includes(file));
  // }

  public watch() {
    // this.watcher = chokidar.watch(this.rootDir, {
    //   ignored: (path, stats) => {
    //     // Ignore node_modules
    //     // Ignore .next
    //     // Ignore .git
    //     // Ignore .vscode
    //     // Ignore output folder
    //     if (
    //       stats &&
    //       (path.includes("node_modules") ||
    //         path.includes(".next") ||
    //         path.includes(".git") ||
    //         path.includes(".vscode") ||
    //         path.includes("public") ||
    //         path.includes(".d.ts") ||
    //         path.includes("package-lock.json") ||
    //         path.includes(".css") ||
    //         path.includes("tsconfig.json") ||
    //         path.includes("package.json") ||
    //         path.includes("resources-scanner-config.js") ||
    //         path.includes(".gitignore") ||
    //         path.includes("README.md") ||
    //         path.includes("next-env.d.ts") ||
    //         path.includes("next.config.ts") ||
    //         path.includes(this.config.output as string) ||
    //         this.includesSourceFiles(path))
    //     ) {
    //       return true;
    //     }

    //     return false;
    //   },
    //   persistent: true,
    // });

    // this.watcher.on("change", this.onFileChange.bind(this));

    // watch source files
    const sourceJsonFiles = Object.values(
      this.config.sourceFiles as SourceFiles
    ).map((file) => {
      return path.resolve(this.rootDir, file);
    });

    this.sourceWatcher = chokidar.watch(sourceJsonFiles as string[], {
      persistent: true,
    });
    this.sourceWatcher.on("change", this.onSourceFileChange.bind(this));
  }

  public onSourceFileChange(path: string) {
    // const locale = utils.getLocaleFromResourcePath(path);
    // const newMessages = jsonCreator.getJsonFileResources(path);
    // const prevMessages = this.originalSourcesData[locale];
    // const diff = utils.jsonDiffKeys(prevMessages, newMessages);
    // const updatedPages: Array<string> = [];
    // Object.keys(diff).forEach((key) => {
    //   const pages = utils.findOutputPathByKey(this.storages.pageKeys, key);

    //   // updatedPages push unique pages
    //   pages.forEach((page) => {
    //     if (!updatedPages.includes(page)) {
    //       updatedPages.push(page);
    //     }
    //   });
    // });
    // // update json files
    // this.originalSourcesData[locale] = newMessages;

    const filePaths = Object.keys(this.storages.pageKeys).reduce(
      (acc: Array<string>, page) => {
        const sourceLocations = utils.pathToOutputFiles(
          page,
          this.config as Config
        );

        return [...acc, ...Object.values(sourceLocations)];
      },
      []
    );

    jsonCreator.replaceJsonFiles(filePaths, this.config as Config);
  }

  public onFileChange(path: string) {
    const pages = this.storages.filePages[path];
    const resourcesDeps = loadFileDependency(path, [], this.config as Config);
    const resources = scan([path, ...resourcesDeps], this.config as Config);

    const filePaths = pages.reduce((acc: Array<string>, page) => {
      const sourceLocations = utils.pathToOutputFiles(
        page,
        this.config as Config
      );

      return [...acc, ...Object.values(sourceLocations)];
    }, []);

    jsonCreator.updateJsonFiles(filePaths, resources, this.config as Config);

    this.updateStoragePages(
      Object.keys(pages).reduce(
        (acc: Record<string, Record<string, any>>, key: string) => {
          return {
            ...acc,
            [key]: {
              ...acc[key],
              ...resources,
            },
          };
        },
        {}
      )
    );
  }

  // public findKey = (targetKey: string) => {
  //   const res = _.filter(_.keys(this.storages.pageKeys), (filePath) =>
  //     _.has(this.storages.pageKeys[filePath], targetKey)
  //   );
  //   return res;
  // };

  public updateStoragePages = (
    pageKeyMap: Record<string, Record<string, any>>
  ) => {
    Object.keys(pageKeyMap).forEach((page) => {
      this.storages.pageKeys[page] = {
        ...this.storages.pageKeys[page],
        ...pageKeyMap[page],
      };
    });
  };
}

export default JsonWatcher;
