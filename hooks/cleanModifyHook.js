const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const gradleBuildFile = path.join(
    context.opts.projectRoot,
    "platforms/android/build.gradle"
  );

  if (fs.existsSync(gradleBuildFile)) {
    let buildGradle = fs.readFileSync(gradleBuildFile, "utf8");

    // Define the modified clean task
    const modifiedCleanTask = `
task cleanModified(type: Delete) {
    delete rootProject.buildDir
}
`;

    // const cleanModifiedRegex =
    //   /task cleanModified\(type: Delete\) \{\s*delete rootProject.buildDir\s*\}/;

    // if (buildGradle.includes("task cleanModified(type: Delete) {")) {
    //   buildGradle = buildGradle.replace(cleanModifiedRegex, "");
    // }

    // Regular expression to find the existing clean task definition
    const cleanTaskRegex =
      /task clean\(type: Delete\) \{\s*delete rootProject.buildDir\s*\}/;
    // Check if the clean task is already defined and replace it
    if (buildGradle.includes("task clean(type: Delete) {")) {
      buildGradle = buildGradle.replace(cleanTaskRegex, modifiedCleanTask);
    } else {
      // If 'allprojects' block doesn't exist, prepend at the top of the file
      buildGradle = modifiedCleanTask + buildGradle;
    }

    // Write the modified build.gradle back to the file
    fs.writeFileSync(gradleBuildFile, buildGradle, "utf8");
  }
};
