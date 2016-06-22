'use strict';

var pageUtils = require('../utilities/page-utils');
var jsConsole = require('../utilities/js-console');
var page = require('../pages/page');
var homePage = require('../pages/home');
var detailPage = require('../pages/detail');


describe('PhoneCat Application', function () {

    beforeEach(function () {
        homePage.visit();
        pageUtils.takeScreenShot('home-page');
    });

    afterEach(function () {
        jsConsole.captureJSLogsOnPage();
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