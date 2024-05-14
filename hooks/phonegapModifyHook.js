const fs = require("fs");
const path = require("path");

module.exports = function (context) {
  const gradleBuildFile = path.join(
    context.opts.projectRoot,
    "platforms/android/phonegap-plugin-barcodescanner/starter-barcodescanner.gradle"
  );

  if (fs.existsSync(gradleBuildFile)) {
    let buildGradle = fs.readFileSync(gradleBuildFile, "utf8");

    const modifiedPhonegap = `
    dependencies {
        implementation(name: 'barcodescanner-release-2.1.5', ext: 'aar') {
            exclude group: 'com.google.zxing'
        }
    }
`;
    buildGradle.replace(
      /dependencies\s*\{\s*implementation\(name:\s*'barcodescanner-release-2\.1\.5',\s*ext:\s*'aar'\)\s*\}/,
      modifiedPhonegap
    );

    fs.writeFileSync(gradleBuildFile, buildGradle, "utf8");
  }
};
