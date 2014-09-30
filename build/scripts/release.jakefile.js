// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

// Release build file. Automates our deployment process.

var git = require("../util/git_runner.js");

var BUILD_COMMAND = require("../config/build_command.js");
var DEV_BRANCH = "dev";
var INTEGRATION_BRANCH = "master";


//*** DO THE RELEASE

task("default", function() {
	console.log("Use 'major', 'minor', or 'bugfix' to perform release");
});

desc("Increment major version number and release");
task("major", function() {
	fail("Major version releases are disabled while we're in 0.x releases.");
});

desc("Increment bugfix version number and release");
task("bugfix", [], function() {
	console.log("\n\nRELEASE OK");
});
