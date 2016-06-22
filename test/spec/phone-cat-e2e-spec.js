'use strict';

var configuration = require(utilsDir + '/configuration');
var pageUtils = require('../utilities/page-utils');
var jsConsole = require('../utilities/js-console');


describe('PhoneCat Application', function () {

    beforeEach(function () {
        browser.get(configuration.get('baseUrl') + 'index.html#!/phones');
        pageUtils.takeScreenShot('home-page');
    });

    afterEach(function () {
        jsConsole.captureJSLogsOnPage();
    });

    it('should filter the phone list as a user types into the search box', function () {
        var phoneList = element.all(by.repeater('phone in $ctrl.phones'));
        var query = element(by.model('$ctrl.query'));

        expect(phoneList.count()).toBe(20);
        pageUtils.takeScreenShot('phones-list');

        

        query.sendKeys('motorola');
        expect(phoneList.count()).toBe(8);
        pageUtils.takeScreenShot('filter-motorola');

        query.clear();
        query.sendKeys('nexus');
        expect(phoneList.count()).toBe(1);
        pageUtils.takeScreenShot('filter-nexus');

        element.all(by.css('.phones li a')).first().click();
        expect(browser.getLocationAbsUrl()).toBe('/phones/nexus-s');
        pageUtils.takeScreenShot('nexus s');

        expect(element(by.binding('$ctrl.phone.name')).getText()).toBe('Nexus S');

        var mainImage = element(by.css('img.phone.selected'));

        expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
        var thumbnails = element.all(by.css('.phone-thumbs img'));

        thumbnails.get(2).click();
        expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);
        pageUtils.takeScreenShot('thumbnail 2');

        thumbnails.get(0).click();
        expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);

    });

});