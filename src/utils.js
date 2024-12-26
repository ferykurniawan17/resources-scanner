// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

function isFileExist(filePath) {
  return fs.existsSync(filePath);
}

function isDirectory(filePath) {
  return fs.lstatSync(filePath).isDirectory();
}

function getFileNameWithoutExt(filePath) {
  const fileName = path.basename(filePath);
  return fileName.replace(path.extname(fileName), "");
}

function getRootProjectDir() {
  return process.cwd();
}

module.exports = {
  isFileExist,
  isDirectory,
  getFileNameWithoutExt,
  getRootProjectDir,
};
