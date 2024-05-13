const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const gradleBuildFile = path.join(
    context.opts.projectRoot,
    "platforms/android/build.gradle"
  );
  let buildGradle = fs.readFileSync(gradleBuildFile, "utf8");

  // Define the plugin block
  const pluginToAdd = `plugins {
    id "com.github.johnrengelman.shadow" version "7.0.0"
    id "java"
  }

import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar

task testJar(type: ShadowJar)  {
    relocate 'com.google.zxing', 'chaersi.shaded.zxing'
    relocate 'com.journeyapps', 'chaersi.shaded.journeyapps'
}
    `;

  // Insert the plugin block before the 'allprojects' block
  if (buildGradle.includes("allprojects {")) {
    buildGradle = buildGradle.replace(
      /allprojects \{/g,
      pluginToAdd + "allprojects {"
    );
  } else {
    // If 'allprojects' block doesn't exist, prepend at the top of the file
    buildGradle = pluginToAdd + buildGradle;
  }

  fs.writeFileSync(gradleBuildFile, buildGradle, "utf8");
};
