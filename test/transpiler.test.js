const fs = require("fs");
const path = require("path");
const { transform } = require("@babel/core");
const findMainJsFile = require("../src/utils/file-finder");
const { transpile } = require("../src/transpiler");

describe("Transpiler", () => {
  const testDir = path.join(__dirname, "test-files");
  const inputFilePath = path.join(testDir, "main.test.js");
  const outputFilePath = path.join(testDir, "main.transpiled.js");

  beforeAll(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    fs.writeFileSync(
      inputFilePath,
      'const x = () => { return "Hello World"; };'
    );
  });

  afterAll(() => {
    fs.unlinkSync(inputFilePath);
    fs.unlinkSync(outputFilePath);
    fs.rmdirSync(testDir);
  });

  test("should find the main JavaScript file", () => {
    const foundFile = findMainJsFile(testDir);
    expect(foundFile).toBe("main.test.js");
  });

  test("should transpile the JavaScript file", () => {
    const code = fs.readFileSync(inputFilePath, "utf8");
    const transformedCode = transform(code, {
      presets: ["@babel/preset-env"],
    }).code;

    fs.writeFileSync(outputFilePath, transformedCode, "utf8");

    const outputCode = fs.readFileSync(outputFilePath, "utf8");
    expect(outputCode).toContain("Hello World");
    expect(outputCode).toContain("var x = function x()");
  });

  test("should replace CDN URLs for tizen platform", () => {
    const { transpile } = require("../src/transpiler");
    const testBuildDir = path.join(__dirname, "test-cdn");
    const testJsDir = path.join(
      testBuildDir,
      "lov_tizen",
      "build",
      "static",
      "js"
    );
    const testFile = path.join(testJsDir, "main.test123.js");

    // Create test directory structure
    if (!fs.existsSync(testJsDir)) {
      fs.mkdirSync(testJsDir, { recursive: true });
    }

    // Create test file with CDN pattern
    fs.writeFileSync(testFile, 'exports=n.p+"static/media/logo.svg";');

    // Run transpile with relative path
    transpile("lov", "tizen", "test/test-cdn");

    // Check the result
    const result = fs.readFileSync(testFile, "utf8");
    expect(result).toContain(
      'exports="https://cdn.withlove.tv/cntv/tizen/media/logo.svg"'
    );

    // Cleanup
    fs.rmSync(testBuildDir, { recursive: true });
  });
});
