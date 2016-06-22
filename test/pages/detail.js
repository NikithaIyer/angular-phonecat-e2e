'use strict';

var page = require('../pages/page');
var thumbnails = page.getAllElements(by.css('.phone-thumbs img'));

var detailPage ={
    getTitle: function () {
        return page.getElement(by.binding('$ctrl.phone.name')).getText()
    },

    getMainImage: function () {
        return page.getElement(by.css('img.phone.selected'));
    },

    selectThumbnail: function (index) {
        return thumbnails.get(index).click();
    }
};

module.exports = detailPage;