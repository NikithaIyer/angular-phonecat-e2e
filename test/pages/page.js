'use strict';

var configuration = require(utilsDir + '/configuration');

var page = {
    visit: function (url) {
        browser.get(configuration.get('baseUrl') + url);
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