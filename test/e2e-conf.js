var Jasmine2Reporter = require('protractor-jasmine2-screenshot-reporter');
var path = require('path');
var basedir = path.resolve(__dirname, '.');
var Proxy = require('browsermob-proxy').Proxy,
  Q = require('q');
var proxyPort = '7075';
var proxyUrl = 'localhost:' + proxyPort;


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
    },
    proxy: {
        proxyType: 'manual',
        httpProxy: proxyUrl,
        sslProxy: proxyUrl
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
    "maxInstances": 1,
    proxy: {
        proxyType: 'manual',
        httpProxy: proxyUrl,
        sslProxy: proxyUrl
    }
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
        global.pagesDir = basedir + '/pages';
        global.outputDir = getOutputDir();

        console.log("<---------------------------------------> ");
        console.log("-> basedir: " + baseDir);
        console.log("-> pagesdir: " + global.pagesDir);
        console.log("-> utilsdir: " + global.utilsDir);
        console.log("-> outputDir: " + global.outputDir);
        console.log("-> browserName: " + global.browserName);
        console.log("-> Protractor OnPrepare DONE");
        console.log("<---------------------------------------> ");

        var proxy = new Proxy();
        proxy.port = 7070;
        console.log("- proxy: ", proxy);

        return Q.ninvoke(proxy, 'start', 7075).then(function (data) {
            console.log('- Started proxy with data - ', data);
            console.log('\t & arguments', arguments);
            browser.params.proxy = proxy;
            browser.params.proxyData = data;
            return data;
        }, function (err) {
            console.log('- Proxy start failed - ', err);
        });
    },

    // Close the report after all tests finish
    afterLaunch: function (exitCode) {
        return new Promise(function(resolve){
            reporter.afterLaunch(resolve.bind(this, exitCode));
            console.log("E2E tests - exit status: " + exitCode);
            if (exitCode != 0) {
                throw new Error ("E2E tests had some failures");
            }
        });
    },
    onComplete: function () {
        console.log('-- onComplete');
    }
};
