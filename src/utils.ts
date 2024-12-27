import fs from "fs";
import path from "path";
import { Config, Ext } from "./type";

function isFileExist(filePath: string) {
  return fs.existsSync(filePath);
}

function isDirectory(filePath: string) {
  return fs.lstatSync(filePath).isDirectory();
}

function getFileNameWithoutExt(filePath: string) {
  const fileName = path.basename(filePath);
  return fileName.replace(path.extname(fileName), "");
}

function getRootProjectDir(): string {
  return process.cwd();
}

function getExtentionFile(path: string, config: Config) {
  let file = config.exts.find((ext: string) => {
    try {
      fs.accessSync(`${path}${ext}`);
      return true;
    } catch (e) {
      return false;
    }
  });

  if (file) return `${path}${file}`;

  file = config.exts.find((ext: Ext) => {
    try {
      fs.accessSync(`${path}/index${ext}`);
      return true;
    } catch (e) {
      return false;
    }
  });

  if (file) return `${path}/index${file}`;

  return null;
}

export default {
  isFileExist,
  isDirectory,
  getFileNameWithoutExt,
  getRootProjectDir,
  getExtentionFile,
};
