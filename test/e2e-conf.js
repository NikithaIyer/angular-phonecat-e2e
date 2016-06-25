var Jasmine2Reporter = require('protractor-jasmine2-screenshot-reporter');
var path = require('path');
var basedir = path.resolve(__dirname, '.');


var currentDate = new Date(),
    currentHoursIn24Hour = currentDate.getHours(),
    currentTimeInHours = currentHoursIn24Hour > 12 ? currentHoursIn24Hour - 12 : currentHoursIn24Hour;

function getUniqueOutputDirName() {
    var monthMap = {
        "1": "Jan",
        "2": "Feb",
        "3": "Mar",
        "4": "Apr",
        "5": "May",
        "6": "Jun",
        "7": "Jul",
        "8": "Aug",
        "9": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
    };

    return currentDate.getDate() + '-' + monthMap[currentDate.getMonth() + 1] + '-' + (currentDate.getYear() + 1900) +
        '-' + currentTimeInHours + 'h-' + currentDate.getMinutes() + 'm';
}
function getOutputDir() {
    var outputDir = basedir + '/output';
    outputDir += '/' + getUniqueOutputDirName();
    return outputDir;
}

var reporter = new Jasmine2Reporter({
    dest: getOutputDir(),
    cleanDestination: true,
    showSummary: true,
    showQuickLinks: true,
    showConfiguration: true,
    reportTitle: "e2e Tests",
    filename: "e2eTests.html"
});

var firefoxCapabilities = {
    browserName: 'firefox',
    "shardTestFiles": true,
    "maxInstances": 1,
    prefs: {
        'config.http.use-cache': false
    }
};

var chromeCapabilities = {
    browserName: 'chrome',
    chromeOptions: {
        args: [
            '--show-fps-counter=true'
        ]
    },
    "shardTestFiles": true,
    "maxInstances": 1
};

var phantomJSCapabilities = {
    browserName: 'phantomjs',
    "shardTestFiles": true,
    "maxInstances": 1
};

var invalidBrowserCapabilities = {
    browserName: "Invalid Browser name provided: " + process.env.browser
};

function getBrowserCapabilities() {
    var desiredCapabilities;
    if ((process.env.browser === undefined) || (process.env.browser === "firefox")) {
        desiredCapabilities = firefoxCapabilities;
    } else if (process.env.browser === "chrome") {
        desiredCapabilities = chromeCapabilities;
    } else if (process.env.browser === "phantomjs") {
        desiredCapabilities = phantomJSCapabilities;
    } else {
        desiredCapabilities = invalidBrowserCapabilities;
    }
    console.log("-> Using " + desiredCapabilities.browserName + " browser for execution");
    console.log("-> Using DesiredCapabilities: " + JSON.stringify(desiredCapabilities));
    return desiredCapabilities;
}
exports.config = {
    framework: 'jasmine',
    seleniumPort: 4444,
    suites: {
        all: './spec/phone-cat-e2e-spec.js'
    },
    suite: "all",
    capabilities: getBrowserCapabilities(),
    // Setup the report before any tests start
    beforeLaunch: function () {
        return new Promise(function (resolve) {
            reporter.beforeLaunch(resolve);
        });
    },

    // Assign the test reporter to each running instance
    onPrepare: function () {
        jasmine.getEnv().addReporter(reporter);
        var width = 1920;
        var height = 1080;
        browser.driver.manage().window().setSize(width, height);
        global.baseDir = basedir;
        global.utilsDir = basedir + '/utilities';
        global.outputDir = getOutputDir();
        console.log(outputDir);
    },

    // Close the report after all tests finish
    afterLaunch: function (exitCode) {
        return new Promise(function (resolve) {
            reporter.afterLaunch(resolve.bind(this, exitCode));
        });
    }
};
