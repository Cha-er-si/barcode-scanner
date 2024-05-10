const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const gradleBuildFilePath = path.join(
    context.opts.projectRoot,
    "platforms/android/app/build.gradle"
  );

  fs.readFile(gradleBuildFilePath, "utf8", function (err, data) {
    if (err) {
      throw new Error("Unable to find Android build.gradle: " + err);
    }

    const pluginsBlock = `
plugins {
    id 'com.github.johnrengelman.shadow' version '8.1.1'
    id 'java'
}`;

    // Find allprojects start index
    const allProjectsIndex = data.indexOf("allprojects {");

    if (allProjectsIndex > -1) {
      // Insert plugins block before allprojects block
      const result =
        data.slice(0, allProjectsIndex) +
        pluginsBlock +
        "\n" +
        data.slice(allProjectsIndex);
      fs.writeFile(gradleBuildFilePath, result, "utf8", function (err) {
        if (err) return console.log(err);
        console.log("Successfully added plugins block before allprojects.");
      });
    } else if (data.indexOf("plugins {") === -1) {
      // No allprojects block found, find end of buildscript block instead
      const buildScriptEndIndex =
        data.indexOf("}", data.indexOf("buildscript")) + 1;
      if (buildScriptEndIndex > -1) {
        const result =
          data.slice(0, buildScriptEndIndex) +
          "\n" +
          pluginsBlock +
          "\n" +
          data.slice(buildScriptEndIndex);
        fs.writeFile(gradleBuildFilePath, result, "utf8", function (err) {
          if (err) return console.log(err);
          console.log("Successfully added plugins block after buildscript.");
        });
      } else {
        // No buildscript block, prepend plugins block to the file
        const result = pluginsBlock + "\n" + data;
        fs.writeFile(gradleBuildFilePath, result, "utf8", function (err) {
          if (err) return console.log(err);
          console.log("Plugins block added at the beginning of the file.");
        });
      }
    }
  });
};
