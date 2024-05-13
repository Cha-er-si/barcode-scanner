const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const rootDir = context.opts.projectRoot;
  const gradleBuildFile = path.join(
    rootDir,
    "platforms",
    "android",
    "app",
    "build.gradle"
  );

  if (fs.existsSync(gradleBuildFile)) {
    let buildGradle = fs.readFileSync(gradleBuildFile, "utf8");

    // Define the modified clean task
    const modifiedCleanTask = `
task cleanModified(type: Delete) {
    delete rootProject.buildDir
}
`;

    // Regular expression to find the existing clean task definition
    const cleanTaskRegex = /task\s+clean\(type:\s*Delete\)\s*\{[^}]*\}/;

    // Check if the clean task is already defined and replace it
    if (cleanTaskRegex.test(buildGradle)) {
      buildGradle = buildGradle.replace(cleanTaskRegex, modifiedCleanTask);
    } else {
      // If not found, we append the new task definition
      buildGradle += modifiedCleanTask;
    }

    // Write the modified build.gradle back to the file
    fs.writeFileSync(gradleBuildFile, buildGradle, "utf8");
  }
};
