'use strict';

require('shelljs/global');
var gulp = require('gulp');
var spawn = require('child_process').spawn;
var fs = require('fs');
var download = require("gulp-download");
var zipFileName = 'output/temp/browsermob-proxy-2.1.1-bin.zip';
var extractedToDir = 'output/temp/';
var port = 7070;
var proxyPort = 7075;
var hostName = "localhost";
var Q = require('q');

function fileExists(filePath)
{
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
}

function logToConsoleAndResolve(command, deferred) {
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
        if (deferred) {
            deferred.resolve("done");
        }
    });
    command.on('error', (code) => {
        console.log(`--> on Error - process exited with error code: ${code}`);
        if (deferred) {
            deferred.resolve("done");
        }
    });
}

function startProxyServer() {
    var deferred = Q.defer();
    stopProxyServer().then(function() {
        const startProxy = spawn('./gulp/startProxyServer.sh', [port, proxyPort, hostName]);
        logToConsoleAndResolve(startProxy, deferred);
    });
    return deferred.promise;
}

function stopProxyServer() {
    var deferred = Q.defer();
    const stopProxy = spawn('./gulp/stopProxyServer.sh');
    logToConsoleAndResolve(stopProxy, deferred);
    return deferred.promise;
}

function runProtractorTests(using) {
    startProxyServer().then(function (){
        let cmd = './node_modules/.bin/' + using + ' ./e2e-conf.js';
        console.log("--> Running tests using command:" + cmd);
        var runTests = exec(cmd, {silent: false});
        console.log("***** " + using + " - Program stdout:", runTests.stdout);
        console.log("***** " + using + " - Program stderr:", runTests.stderr);
        console.log("***** " + using + " - Exit code: ", runTests.code);
        if (runTests.code !== 0) {
            echo("***** " + using + " - Error: command - " + cmd + " - FAILED");
            exit(1);
        }
        stopProxyServer();
    });
}

function downloadBrowserMobProxyServer() {
    var deferred = Q.defer();
    console.log("'" + zipFileName + "' not found. Download it!");
    download("https://github.com/lightbody/browsermob-proxy/releases/download/browsermob-proxy-2.1.1/browsermob-proxy-2.1.1-bin.zip")
      .pipe(gulp.dest(extractedToDir));
    if (fileExists(zipFileName)) {
        deferred.resolve("done");
    }
    return deferred.promise;
}

function downloadProxy() {
    var deferred = Q.defer();
    if (!fileExists(zipFileName)) {
        downloadBrowserMobProxyServer().then(function () {
            console.log("'" + zipFileName + "' downloaded!");
            deferred.resolve("done");
        });
    } else {
        console.log("File - '" + zipFileName + "' exists. Do not re-download");
        deferred.resolve("done");
    }
    return deferred.promise;
}

function unzipProxy() {
    var deferred = Q.defer();
    const upzipProxy = spawn('unzip', ['-o', zipFileName, '-d', extractedToDir]);
    logToConsoleAndResolve(upzipProxy, deferred);
    return deferred.promise;
}

function downloadBrowserMobProxyServerIfNotExisting() {
    console.log("** browsermob-proxy setup");
    return downloadProxy().then(function (){
        return unzipProxy();
    });
}

gulp.task('e2e', function () {
    runProtractorTests("protractor");
});


function getWebDriver() {
    var deferred = Q.defer();
    console.log("** webdriver-manager update");
    const update = spawn('./node_modules/.bin/webdriver-manager', ['update']);
    logToConsoleAndResolve(update, deferred);
    return deferred.promise;
}

function getRequiredLibraries() {
    getWebDriver().then(function () {
        console.log("--> Updated WebDriver")
    });
    downloadBrowserMobProxyServerIfNotExisting().then(function () {
        console.log("--> Proxy downloaded & setup");
    });
}

gulp.task('e2eSetup', function (callback) {
    getRequiredLibraries();
});
