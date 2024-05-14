const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const gradleBuildFile = path.join(
    context.opts.projectRoot,
    "platforms/android/build.gradle"
  );
  let buildGradle = fs.readFileSync(gradleBuildFile, "utf8");

  const classPath = `classpath "gradle.plugin.com.github.jengelman.gradle.plugins:shadow:7.0.0"\n`;

  const dependencyRegex = /(dependencies \{[^}]*)(\})/;

  if (dependencyRegex.test(buildGradle)) {
    buildGradle = buildGradle.replace(
      /(\s*\/\/ in the individual module build.gradle files[^\}]*)(\s*\})/,
      `$1\n${classPath}\n$2`
    );
  }

  const destionationPath = path.join(
    context.opts.projectRoot,
    "platforms/android/app/src/main/libs"
  );

  // Define the plugin block
  const pluginToAdd = `plugins {
    id "java"
  }
  
  apply plugin: "com.github.johnrengelman.shadow"
  
  import com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar
  
  task customShadowJar(type: ShadowJar) {
    relocate 'com.google.zxing', 'chaersi.shaded.zxing'
    relocate 'com.journeyapps', 'chaersi.shaded.journeyapps'
  
    // archiveBaseName.set('chaersi-shaded-library')
    // archiveVersion.set('1.0.0')
    // archiveClassifier.set('')
  }`;

  //   destinationDirectory.set(file('${destionationPath
  //     .toString()
  //     .replace(/\\|\//g, "/")}'))

  if (buildGradle.includes("allprojects {")) {
    buildGradle = buildGradle.replace(
      /allprojects \{/g,
      pluginToAdd + "\n allprojects {"
    );
  } else {
    buildGradle = pluginToAdd + buildGradle;
  }

  fs.writeFileSync(gradleBuildFile, buildGradle, "utf8");
};
