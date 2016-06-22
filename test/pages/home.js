'use strict';

var page = require('../pages/page');
var query = page.getElement(by.model('$ctrl.query'));

var homePage = {

    visit: function () {
      return page.visit('index.html');
    },

    getPhoneList: function () {
        return page.getAllElements(by.repeater('phone in $ctrl.phones'));
    },

    searchFor: function (phoneName) {
        query.clear();
        query.sendKeys(phoneName);
    },

    selectFirstFromList: function () {
        return page.getAllElements(by.css('.phones li a')).first().click();
    }

};

module.exports = homePage;