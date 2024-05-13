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
    id "com.github.johnrengelman.shadow" version "7.1.2"
    id "java"
  }
  
  import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
  
  task customShadowJar(type: ShadowJar) {
      relocate 'com.google.zxing', 'chaersi.shaded.zxing'
      relocate 'com.journeyapps', 'chaersi.shaded.journeyapps'
  
      archiveBaseName.set('chaersi-shaded-library')
      archiveVersion.set('1.0.0')
      archiveClassifier.set('')
  
      destinationDir = file("/platforms/android/app/src/main/libs")
  }
  
  build.dependsOn customShadowJar
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
