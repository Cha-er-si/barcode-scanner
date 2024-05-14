const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const gradleRepositoriesFile = path.join(
    context.opts.projectRoot,
    "platforms/android/repositories.gradle"
  );
  let repositoriesGradle = fs.readFileSync(gradleRepositoriesFile, "utf8");

  const repositories = `
  gradlePluginPortal()
  maven {
    url "https://plugins.gradle.org/m2/"
  }`;

  const repoRegex = /(ext\.repos = \{[^}]*)(\})/;

  if (repoRegex.test(repositoriesGradle)) {
    repositoriesGradle = repositoriesGradle.replace(
      repoRegex,
      `$1\n${repositories}\n$2`
    );
  } else {
    repositoriesGradle = pluginToAdd + repositoriesGradle;
  }

  fs.writeFileSync(gradleRepositoriesFile, repositoriesGradle, "utf8");
};
