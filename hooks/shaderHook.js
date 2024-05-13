const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const gradleBuildFile = path.join(
    context.opts.projectRoot,
    "platforms/android/build.gradle"
  );
  let buildGradle = fs.readFileSync(gradleBuildFile, "utf8");

  // Check if the plugin is already added
  if (!buildGradle.includes("com.github.johnrengelman.shadow")) {
    // Define the plugin block
    const pluginToAdd = `plugins {
            id "com.github.johnrengelman.shadow" version "7.1.1"
        }
        `;

    /*
        
shadowJar {
    relocate 'com.google.zxing', 'shadowed.com.google.zxing'
    relocate 'com.journeyapps', 'shadowed.com.journeyapps'
}

tasks.build.dependsOn shadowJar
 */

    // Insert the plugin block at the top of the file
    buildGradle = pluginToAdd + buildGradle;
    fs.writeFileSync(gradleBuildFile, buildGradle, "utf8");
  }
};
