const core = require("@actions/core");
const { transpile } = require("./transpiler");

async function run() {
  try {
    const channel = core.getInput("channel");
    const platform = core.getInput("platform");
    const buildPath =
      core.getInput("build-path") ||
      core.getInput("build_path") ||
      "./platformBuilds";

    if (!channel || !platform) {
      core.setFailed("Channel and platform inputs are required");
      return;
    }

    core.info(`Transpiling ${channel} for ${platform}...`);

    await transpile(channel, platform, buildPath);

    core.info("Transpilation completed successfully");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
