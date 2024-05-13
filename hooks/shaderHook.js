const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const gradleBuildFile = path.join(
    context.opts.projectRoot,
    "platforms/android/app/build.gradle"
  );
  let buildGradle = fs.readFileSync(gradleBuildFile, "utf8");

  // Define the plugin block
  const pluginToAdd = `plugins {
    id "com.github.johnrengelman.shadow" version "7.1.1"
    id "java"
  }`;

  const shaderConfig = `
    `;

  buildGradle = pluginToAdd + buildGradle;

  if (buildGradle.includes("allprojects {")) {
    buildGradle = buildGradle.replace(
      /allprojects \{/g,
      shaderConfig + "allprojects {"
    );
  } else {
    buildGradle = shaderConfig + buildGradle;
  }

  fs.writeFileSync(gradleBuildFile, buildGradle, "utf8");
};
