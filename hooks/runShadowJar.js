#!/usr/bin/env node
var exec = require("child_process").exec;

exec("./gradlew customShadowJar", function (err, stdout, stderr) {
  console.log(stdout);
  if (err) {
    console.error("Error executing customShadowJar: ", stderr);
    throw err; // Fail the build on error
  }
});
