var configuration = require(utilsDir + '/configuration');
var fs = require('fs');
require('shelljs/global');

function removeUnwantedContentFromHAR(harContent) {
  console.log("--> Trimming unwanted content from captured HAR file");
  var originalLength = harContent.length;
  console.log("\tHAR size before trimming: " + originalLength);
  var harContentAsJson = JSON.parse(harContent);
  var message = "";
  for (var index = 0; index < harContentAsJson.log.entries.length; index++) {
    var status = harContentAsJson.log.entries[index].response.status;
    message = "-- Index: " + index;
    message += "\tresponse code: " + status;
    message += "\tcontent size: " + harContentAsJson.log.entries[index].response.content.size;
    if (status === 200) {
      message += "\tReseting content";
      harContentAsJson.log.entries[index].response.content.text = "";
      message += "\tContent text size = " + harContentAsJson.log.entries[index].response.content.text.length;
    } else {
      message += "\tKeeping content as is";
    }
    console.log(message);
  }
  console.log("-------------------------------------------------- ");
  var stringifiedUpdatedHarContent = JSON.stringify(harContentAsJson);
  var lengthAfterTrimming = stringifiedUpdatedHarContent.length;
  console.log("\tTrimmed HAR size: " + lengthAfterTrimming);
  console.log("\tHAR file size saved: " + (originalLength-lengthAfterTrimming));
  console.log("-------------------------------------------------- ");
  return stringifiedUpdatedHarContent;
}

var PerfMetric = {
  saveHARFile: function (name, done) {
    browser.params.proxy.getHAR(browser.params.proxyData.port, function (err, harData) {
      console.log("-------------------------------------------------- ");
      if (harData.length === 0) {
        var errorMessage = "--> ERROR - No data captured in HAR file";
        console.log(errorMessage);
        expect(harData.length === 0).toBeFalsy(errorMessage);
      } else {
        console.log("--> Saving captured HAR");
        console.log(name + " - Writing HAR file - number of n/w entries: ", JSON.parse(harData).log.entries.length);
        console.log("-------------------------------------------------- ");
        // fs.writeFileSync(outputDir + "/" + name + ".har", harData, "utf8");
        var date = new Date();
        var timeStamp = date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
        var harFileName = outputDir + "/" + name + "_trimmed_" + timeStamp + ".har";
        console.log("--> HAR file name: " + harFileName);
        fs.writeFileSync(harFileName, removeUnwantedContentFromHAR(harData), "utf8");
      }
      done();
      console.log("-------------------------------------------------- ");
    });
  },

  startHARCapture: function (name, done) {
    console.log("-------------------------------------------------- ");
    console.log("Start HAR capture");
    console.log("browser.params.proxy - ", browser.params.proxy);
    console.log("browser.params.proxyData - ", browser.params.proxyData);
    var captureHeaders=true;
    var captureContent=true;
    var captureBinaryContent=false;
    browser.params.proxy.startHAR(browser.params.proxyData.port, name, captureHeaders, captureContent, captureBinaryContent, done);
    console.log("-------------------------------------------------- ");
  }
};
module.exports = PerfMetric;
