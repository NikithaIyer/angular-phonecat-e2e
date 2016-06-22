'use strict';
var fs = require('fs');

var JSConsole = {
    captureJSLogsOnPage: function () {
        browser.manage().logs().get('browser').then(function (browserLog) {
            var i = 0;
            var infoMessages = [],
                warningMessages = [],
                errorMessages = [];


            for (i; i <= browserLog.length - 1; i++) {
                if (browserLog[i].level.name === 'INFO') {
                    infoMessages.push(browserLog[i]);
                }
                if (browserLog[i].level.name === 'WARNING') {
                    warningMessages.push(browserLog[i]);
                }
                if (browserLog[i].level.name === 'SEVERE') {
                    errorMessages.push(browserLog[i]);
                }
            }
            console.log("--> JS Console logs on page of type (INFO): " + infoMessages.length);
            console.log("--> JS Console logs on page of type (WARNING): " + warningMessages.length);
            console.log("--> JS Console logs on page of type (ERROR): " + errorMessages.length);
            fs.writeFileSync(outputDir + "/consoleError.json", JSON.stringify(errorMessages));
            fs.writeFileSync(outputDir + "/consoleWarning.json", JSON.stringify(warningMessages));
            fs.writeFileSync(outputDir + "/consoleInfo.json", JSON.stringify(infoMessages));
        });
    }
};
module.exports = JSConsole;
