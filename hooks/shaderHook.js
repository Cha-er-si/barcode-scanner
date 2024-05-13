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

  fs.readFile(gradleBuildFile, "utf8", function (err, data) {
    if (err) {
      throw new Error("Failed to read build.gradle: " + err);
    }

    // Ensure the plugin is added
    if (!data.includes("com.github.johnrengelman.shadow")) {
      var pluginToAdd =
        "id 'com.github.johnrengelman.shadow' version '7.1.1'\n";
      data = data.replace("plugins {", `plugins {\n    ${pluginToAdd}`);
    }

    // Add shadowJar configuration if not already present
    if (!data.includes("shadowJar {")) {
      var shadowConfig = `
shadowJar {
    relocate 'com.google.zxing', 'chaersi.shaded.zxing'
    relocate 'com.journeyapps', 'chaersi.shaded.journeyapps'
}
`;
      // Insert before the first task or at the end of the file
      var position = data.lastIndexOf("}");
      data =
        data.substring(0, position) + shadowConfig + data.substring(position);
    }

    // Write the modified build.gradle back to file
    fs.writeFile(gradleBuildFile, data, "utf8", function (err) {
      if (err) throw new Error("Failed to write build.gradle: " + err);
    });
  });
};
