'use strict';

require('shelljs/global');
var gulp = require('gulp');
var spawn = require('child_process').spawn;

function logToConsole(command) {
    command.stdout.on('data', (data) => {
        console.log(`${data}`);
});
    command.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
});
    command.on('close', (code) => {
        console.log(`--> on Close - process exited with code: ${code}`);
    if (code != 0) {
        process.exit(code);
    }
});
    command.on('error', (code) => {
        console.log(`--> on Error - process exited with error code: ${code}`);
});
}

function runProtractorTests(using) {
    let cmd = './node_modules/.bin/protractor ./e2e-conf.js';
    console.log("--> Running tests using command:" + cmd);
    var runTests = exec(cmd, {silent: false});
    console.log("***** " + using + " - Program stdout:", runTests.stdout);
    console.log("***** " + using + " - Program stderr:", runTests.stderr);
    console.log("***** " + using + " - Exit code: ", runTests.code);
    if (runTests.code !== 0) {
        echo("***** " + using + " - Error: command - " + cmd + " - FAILED");
        exit(1);
    }
}

gulp.task('e2e', function () {
    runProtractorTests("protractor");
});


gulp.task('e2eSetup', function () {
    const update = spawn('./node_modules/.bin/webdriver-manager', ['update']);
    logToConsole(update);
});

