'use strict';

function getTestExecutionEnvironment() {
    var envName = process.env.env ? process.env.env : "local";
    console.log("--> Running specs against environment: " + envName);
    return envName;
}

function Configuration() {
    var envConfig = require('../config/env.json');
    let testExecutionEnvironment = getTestExecutionEnvironment();
    this.env = envConfig[testExecutionEnvironment];
    this.env["env"] = testExecutionEnvironment;
    this.env["username"] = process.env.username;
    this.env["password"] = process.env.password;
    this.screenShotCounter = 0;
    console.log("--> with configuration " + JSON.stringify(this.env));
}

var Configurations = new Configuration();

Configurations.get = function (param) {
    return this.env[param];
};

Configurations.getScreenShotCounter = function() {
    return ++this.screenShotCounter;
};

module.exports = Configurations;