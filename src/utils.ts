import fs from "fs";
import path from "path";

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

function getRootProjectDir() {
  return process.cwd();
}

export default {
  isFileExist,
  isDirectory,
  getFileNameWithoutExt,
  getRootProjectDir,
};
