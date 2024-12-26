// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const utils = require("./utils");

function getExtentionFile(path, config) {
  let file = config.exts.find((ext) => {
    try {
      fs.accessSync(`${path}${ext}`);
      return true;
    } catch (e) {
      return false;
    }
  });

  if (file) return `${path}${file}`;

  file = config.exts.find((ext) => {
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

function extractFilePaths(code, locationFile, config) {
  // Regular expression untuk mencari import statement dan mengekstrak path file
  const regex = /from\s+['"]([^'"]+)['"]/g;
  // const regex =
  //   /import\s+([^\s]+(?:\s*,\s*[^\s]+)*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g;

  const filePaths = [];
  let match;

  const root = utils.getRootProjectDir();

  while ((match = regex.exec(code)) !== null) {
    const alias = Object.keys(config.alias).find((alias) =>
      match[1].startsWith(alias)
    );

    if (alias) {
      const path = match[1].replace(alias, config.alias[alias]);
      const withExtention = getExtentionFile(`${root}/${path}`, config);

      if (withExtention) filePaths.push(withExtention);
    } else {
      if (match[1].startsWith(".")) {
        const fullPath = path.resolve(path.dirname(locationFile), match[1]);

        const withExtention = getExtentionFile(fullPath, config);

        if (withExtention) filePaths.push(withExtention);
      }
    }
  }

  return filePaths;
}

function loadFileDependency(pathFile, paths, config) {
  const codeString = fs.readFileSync(pathFile, "utf-8");
  const filePaths = extractFilePaths(codeString, pathFile, config);

  filePaths.forEach((filePath) => {
    if (!paths.includes(filePath)) {
      paths.push(filePath);
      loadFileDependency(filePath, paths, config);
    }
  });

  return [...filePaths, ...paths];
}

module.exports = loadFileDependency;
