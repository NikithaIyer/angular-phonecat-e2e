'use strict';

var configuration = require(utilsDir + '/configuration');

var page = {
    loginIfRequired: function () {
        var userNameElement = element(by.id("username"));
        userNameElement.isPresent().then(function(isPresent) {
            if (isPresent) {
                userNameElement.clear().sendKeys(configuration.get("username"));
                element(by.id("pwd")).clear().sendKeys(configuration.get("password"));
                element(by.buttonText("Login")).click();
            }
        })
    },

    visit: function (url) {
        browser.ignoreSynchronization = true;
        browser.get(configuration.get('baseUrl') + url);
        this.loginIfRequired();
        browser.ignoreSynchronization = false;
        browser.waitForAngular();
    },

    getAllElements: function (by) {
        return element.all((by));
    },

    getElement: function (by) {
        return element((by));
    },

    getUrl: function () {
        return browser.getLocationAbsUrl();
    }

};

module.exports = page;