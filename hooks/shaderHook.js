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

    // Locate the end of the buildscript block by finding the closing brace that matches the opening brace of the buildscript
    let buildScriptDepth = 0;
    let buildScriptEnd = -1;
    let inBuildScript = false;

    for (let i = 0; i < data.length; i++) {
      if (data.substring(i).startsWith("buildscript {")) {
        inBuildScript = true;
        buildScriptDepth++;
      }
      if (data[i] === "{" && inBuildScript) {
        buildScriptDepth++;
      }
      if (data[i] === "}" && inBuildScript) {
        buildScriptDepth--;
        if (buildScriptDepth === 0) {
          buildScriptEnd = i + 1;
          break;
        }
      }
    }

    if (buildScriptEnd !== -1 && data.indexOf("plugins {") === -1) {
      // Insert the plugins block immediately after the buildscript block
      const result =
        data.slice(0, buildScriptEnd) +
        pluginsBlock +
        "\n" +
        data.slice(buildScriptEnd);
      fs.writeFile(gradleBuildFilePath, result, "utf8", function (err) {
        if (err) return console.log(err);
        console.log("Successfully added plugins block after buildscript.");
      });
    } else if (data.indexOf("plugins {") > -1) {
      // If plugins block already exists, ensure it contains the necessary plugins
      const neededPlugins = [
        "id 'com.github.johnrengelman.shadow' version '8.1.1'",
        "id 'java'",
      ];
      let pluginsSection = data.substring(
        data.indexOf("plugins {"),
        data.indexOf("}", data.indexOf("plugins {")) + 1
      );
      neededPlugins.forEach((plugin) => {
        if (!pluginsSection.includes(plugin.split(" ")[1])) {
          pluginsSection = pluginsSection.replace(
            /plugins\s*{/,
            `$&\n    ${plugin}`
          );
        }
      });
      const newData = data.replace(/plugins\s*{[^}]*}/, pluginsSection);
      fs.writeFile(gradleBuildFilePath, newData, "utf8", function (err) {
        if (err) return console.log(err);
        console.log("Updated existing plugins block.");
      });
    }
  });
};
