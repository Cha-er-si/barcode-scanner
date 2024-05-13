var fs = require("fs");
var path = require("path");

module.exports = function (context) {
  var rootDir = context.opts.projectRoot;
  var gradleBuildFile = path.join(
    rootDir,
    "platforms",
    "android",
    "app",
    "build.gradle"
  );

  console.log("Attempting to read build.gradle from: ", gradleBuildFile);

  fs.readFile(gradleBuildFile, "utf8", function (err, data) {
    if (err) {
      console.log("Error reading build.gradle: ", err);
      return;
    }

    var modified = false;

    if (!data.includes("com.github.johnrengelman.shadow")) {
      var pluginToAdd =
        "id 'com.github.johnrengelman.shadow' version '7.1.1'\n";
      data = data.replace("plugins {", `plugins {\n    ${pluginToAdd}`);
      modified = true;
    }

    if (!data.includes("shadowJar {")) {
      var shadowConfig = `
shadowJar {
    relocate 'com.google.zxing', 'shadowed.com.google.zxing'
    relocate 'com.journeyapps', 'shadowed.com.journeyapps'
}

tasks.build.dependsOn shadowJar
`;
      var position = data.lastIndexOf("}");
      data =
        data.substring(0, position) + shadowConfig + data.substring(position);
      modified = true;
    }

    if (modified) {
      console.log("Writing modifications to build.gradle...");
      fs.writeFile(gradleBuildFile, data, "utf8", function (writeErr) {
        if (writeErr) {
          console.log("Error writing build.gradle: ", writeErr);
        } else {
          console.log("build.gradle updated successfully.");
        }
      });
    } else {
      console.log("No modifications needed for build.gradle.");
    }
  });
};
