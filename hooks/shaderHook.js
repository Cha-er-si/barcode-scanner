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

  if (!buildGradle.includes("task clean(type: Delete)")) {
    // Define the custom task or modify as needed
    const customTask = `
task cleanModified(type: Delete) {
  delete rootProject.buildDir
}
`;
    const cleanTaskRegex = /task clean\(type: Delete\)[\s\S]*?\}/;

    if (buildGradle.match(cleanTaskRegex)) {
      // Replace existing 'clean' task
      buildGradle = buildGradle.replace(cleanTaskRegex, customTask.trim());
    } else {
      // If no 'clean' task exists, add the new one
      buildGradle = buildGradle + customTask;
    }

    fs.writeFileSync(gradleBuildFile, buildGradle, "utf8");
  }

  fs.writeFileSync(gradleBuildFile, buildGradle, "utf8");
};
