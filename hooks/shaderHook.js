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

    // Determine the location to insert the plugins block
    const buildScriptEndIndex =
      data.indexOf("}", data.indexOf("buildscript")) + 1;
    if (buildScriptEndIndex > -1 && data.indexOf("plugins {") === -1) {
      // Insert plugins block after buildscript block
      const result =
        data.slice(0, buildScriptEndIndex) +
        pluginsBlock +
        data.slice(buildScriptEndIndex);
      fs.writeFile(gradleBuildFilePath, result, "utf8", function (err) {
        if (err) return console.log(err);
        console.log("Successfully added plugins block after buildscript.");
      });
    } else if (data.indexOf("plugins {") > -1) {
      // Plugins block already exists, append if necessary
      if (
        !data.includes("id 'com.github.johnrengelman.shadow' version '8.1.1'")
      ) {
        const modifiedPluginsBlock = data.replace(
          /plugins\s*{/,
          `$&\n    id 'com.github.johnrengelman.shadow' version '8.1.1'`
        );
        const finalData = modifiedPluginsBlock.replace(
          /plugins\s*{/,
          `$&\n    id 'java'`
        );
        fs.writeFile(gradleBuildFilePath, finalData, "utf8", function (err) {
          if (err) return console.log(err);
          console.log("Successfully appended to existing plugins block.");
        });
      }
    } else {
      // No buildscript block or plugins block, prepend to the file
      const result = pluginsBlock + "\n" + data;
      fs.writeFile(gradleBuildFilePath, result, "utf8", function (err) {
        if (err) return console.log(err);
        console.log("Plugins block added at the beginning of the file.");
      });
    }
  });
};
