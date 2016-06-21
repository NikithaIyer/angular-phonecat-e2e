'use strict';

var fs = require('fs');
var configuration = require (utilsDir + '/configuration');


var PageUtils = {
    screenShotCounter: 0,

    takeScreenShot: function (fileName) {
        var fullScreenShotPath =  outputDir + "/" + configuration.getScreenShotCounter() + "_" + fileName + ".png";
        browser.takeScreenshot().then(function (png) {
            console.log("[Screenshot saved as: '" + fullScreenShotPath + "']");
            var stream = fs.createWriteStream(fullScreenShotPath);
            stream.write(new Buffer(png, 'base64'));
            stream.end();
        });
    }
};
module.exports = PageUtils;