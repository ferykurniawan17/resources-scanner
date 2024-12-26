// eslint-disable-next-line @typescript-eslint/no-var-requires
const fileScanner = require("./fileScanner");

function scan(files) {
  const keys = {};
  files.forEach((file) => {
    const fileKeys = fileScanner.scan(file);
    Object.assign(keys, fileKeys);
  });

  return keys;
}

module.exports = { scan };
