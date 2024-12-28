import chokidar from "chokidar";
import { Config, Storage } from "../type";
import utils from "../utils";
import { scanFile, scan } from "../filesScanner";
import jsonCreator from "../jsonCreator";
import loadFileDependency from "../fileDependencies";

class JsonWatcher {
  private storages: Storage = {
    filePages: {},
    pageKeys: {},
  };

  private config: Partial<Config> = {};

  private rootDir: string = utils.getRootProjectDir();

  private watcher: any;
  private sourceWatcher: any;

  constructor(storages: Storage, config: Config) {
    this.storages = storages;
    this.config = config;
  }

  public watch() {
    this.watcher = chokidar.watch(this.rootDir, {
      ignored: (path, stats) => {
        // Ignore node_modules
        // Ignore .next
        // Ignore .git
        // Ignore .vscode
        // Ignore output folder
        if (
          stats &&
          (path.includes("node_modules") ||
            path.includes(".next") ||
            path.includes(".git") ||
            path.includes(".vscode") ||
            path.includes("public") ||
            path.includes(".d.ts") ||
            path.includes("package-lock.json") ||
            path.includes(".css") ||
            path.includes("tsconfig.json") ||
            path.includes("package.json") ||
            path.includes("resources-scanner-config.js") ||
            path.includes(".gitignore") ||
            path.includes("README.md") ||
            path.includes("next-env.d.ts") ||
            path.includes("next.config.ts") ||
            path.includes(this.config.output as string))
        ) {
          return true;
        }

        return false;
      },
      persistent: true,
    });

    this.sourceWatcher = chokidar.watch(this.config.output as string, {
      persistent: true,
    });

    this.watcher.on("change", this.onFileChange.bind(this));
    this.sourceWatcher.on("change", this.onSourceFileChange.bind(this));
  }

  public onSourceFileChange(path: string) {}

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
  }

  public onFileAdd(path: string) {
    console.log("File added", path);
  }
}

export default JsonWatcher;
