const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const gradleBuildFile = path.join(
    context.opts.projectRoot,
    "platforms/android/build.gradle"
  );
  let buildGradle = fs.readFileSync(gradleBuildFile, "utf8");

  // Define the plugin block
  const pluginToAdd = `import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar

  plugins {
    id "com.github.johnrengelman.shadow" version "7.1.1"
  }

  shadowJar {
    relocate 'com.google.zxing', 'shadowed.com.google.zxing'
    relocate 'com.journeyapps', 'shadowed.com.journeyapps'
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
