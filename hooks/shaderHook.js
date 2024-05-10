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

    if (data.includes("plugins {")) {
      // Append to existing plugins block
      const result = data.replace(
        /plugins\s*{/,
        `$&\n    id 'com.github.johnrengelman.shadow' version '8.1.1'\n    id 'java'`
      );
      fs.writeFile(gradleBuildFilePath, result, "utf8", function (err) {
        if (err) return console.log(err);
      });
    } else {
      // Insert plugins block at the beginning of the file
      const result = pluginsBlock + "\n" + data;
      fs.writeFile(gradleBuildFilePath, result, "utf8", function (err) {
        if (err) return console.log(err);
      });
    }
  });
};
