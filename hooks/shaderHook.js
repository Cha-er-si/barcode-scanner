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
    id "com.github.johnrengelman.shadow" version "7.1.2"
    id "java"
  }`;

  const shaderConfig = `task customShadowJar(type: ShadowJar) {
      relocate 'com.google.zxing', 'chaersi.shaded.zxing'
      relocate 'com.journeyapps', 'chaersi.shaded.journeyapps'
  
      archiveBaseName.set('chaersi-shaded-library')
      archiveVersion.set('1.0.0')
      archiveClassifier.set('')
  
      destinationDir = file("/platforms/android/app/src/main/libs")
  }
  
  build.dependsOn customShadowJar
    `;

  // Insert the plugin block before the 'buildscript' block
  if (buildGradle.includes("buildscript {")) {
    buildGradle = buildGradle.replace(
      /buildscript \{/g,
      pluginToAdd + "buildscript {"
    );
  } else {
    // If 'buildscript' block doesn't exist, prepend at the top of the file
    buildGradle = pluginToAdd + buildGradle;
  }

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
