const fs = require("fs");

function findMainJsFile(dir) {
  const files = fs.readdirSync(dir);
  return files.find((file) => /^main\.[a-zA-Z0-9]+\.js$/.test(file));
}

module.exports = findMainJsFile;