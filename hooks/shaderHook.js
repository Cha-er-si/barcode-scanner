const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const root = context.opts.projectRoot;
  const gradleBuildFilePath = path.join(
    root,
    "platforms",
    "android",
    "build.gradle"
  );

  fs.readFile(gradleBuildFilePath, "utf8", function (err, data) {
    if (err) {
      throw new Error("Unable to find Android build.gradle: " + err);
    }

    if (!data.includes("id 'com.github.johnrengelman.shadow'")) {
      const result = data.replace(
        /plugins \{/,
        `plugins {
                id 'com.github.johnrengelman.shadow' version '8.1.1'
                id 'java'
            `
      );

      fs.writeFile(gradleBuildFilePath, result, "utf8", function (err) {
        if (err) return console.log(err);
      });
    }
  });
};
