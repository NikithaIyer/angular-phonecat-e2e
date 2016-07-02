'use strict';

var pageUtils = require(utilsDir + '/page-utils');
var PerfMetric = require(utilsDir + '/perfMetric');
var jsConsole = require(utilsDir + '/js-console');
var page = require(pagesDir + '/page');
var homePage = require(pagesDir + '/home');
var detailPage = require(pagesDir + '/detail');

var specName = "PhoneCatApp_spec";

describe('PhoneCat Application', function () {

    beforeEach(function (done) {
        PerfMetric.startHARCapture(specName, done);
        homePage.visit();
        pageUtils.takeScreenShot('home-page');
    });

    afterEach(function (done) {
        jsConsole.captureJSLogsOnPage();
        PerfMetric.saveHARFile(specName, done);
    });

    it('should filter the phone list as a user types into the search box and show details of a selected phone', function () {
        var phoneList = homePage.getPhoneList();
        expect(phoneList.count()).toBe(20);
        pageUtils.takeScreenShot('phones-list');

        homePage.searchFor('samsung');
        expect(phoneList.count()).toBe(5);
        pageUtils.takeScreenShot('filter-samsung');

        homePage.searchFor('nexus');
        expect(phoneList.count()).toBe(1);
        pageUtils.takeScreenShot('filter-nexus');

        homePage.selectFirstFromList();
        expect(page.getUrl()).toBe('/phones/nexus-s');
        pageUtils.takeScreenShot('nexus-s-detail');

        var title = detailPage.getTitle();
        expect(title).toBe('Nexus S');

        var mainImage = detailPage.getMainImage();
        expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.0.jpg/);
        
        
        detailPage.selectThumbnail(2);
        expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.2.jpg/);
        pageUtils.takeScreenShot('thumbnail-2');

        detailPage.selectThumbnail(3);
        expect(mainImage.getAttribute('src')).toMatch(/img\/phones\/nexus-s.3.jpg/);
        pageUtils.takeScreenShot('thumbnail-3');

    });

});