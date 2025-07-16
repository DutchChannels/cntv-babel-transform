// filepath: /cntv-babel-transform/cntv-babel-transform/src/transpiler.js
const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");
const findMainJsFile = require("./utils/file-finder");

function transpile(channel, selectedPlatform, buildPath = "./platformBuilds") {
  let targetDir = path.join(
    process.cwd(),
    buildPath,
    `${channel}_${selectedPlatform}`,
    "build",
    "static",
    "js"
  );

  const mainJsFile = findMainJsFile(targetDir);

  if (mainJsFile) {
    const inputFilePath = path.join(targetDir, mainJsFile);
    const outputFilePath = inputFilePath;

    const code = fs.readFileSync(inputFilePath, "utf8");

    let transformedCode = babel.transformSync(code, {
      presets: ["@babel/preset-env"],
    }).code;

    const cdn = {
      lov: "https://cdn.withlove.tv/cntv/tizen",
      nfn: "https://cdn.newfaithnetwork.com/cntv/tizen",
    };

    if (selectedPlatform === "tizen") {
      transformedCode = transformedCode.replace(
        /exports\s*=\s*n\.p\s*\+\s*"static\/media/g,
        `exports="${cdn[channel]}/media`
      );
    }

    fs.writeFileSync(outputFilePath, transformedCode, "utf8");
    fs.writeFileSync(path.join(targetDir, "main.js"), transformedCode, "utf8");
  } else {
    throw new Error("main.xxxxxxxx.js file not found in the directory.");
  }
}

module.exports = { transpile };
