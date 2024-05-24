var exec = require("cordova/exec");

var scanInProgress = false;

var ChaersiBarcodeScanner = function () {};

ChaersiBarcodeScanner.startCameraScan = function (
  successCallback,
  errorCallback
) {
  if (errorCallback == null) {
    errorCallback = function () {};
  }

  if (typeof errorCallback != "function") {
    console.log(
      "ChaersiBarcodeScanner.startCameraScan failure: failure parameter not a function"
    );
    return;
  }

  if (typeof successCallback != "function") {
    console.log(
      "ChaersiBarcodeScanner.startCameraScan failure: success callback parameter must be a function"
    );
    return;
  }

  if (scanInProgress) {
    errorCallback("Scan is already in progress");
    return;
  }

  scanInProgress = true;

  exec(
    function (result) {
      scanInProgress = false;
      successCallback(result);
    },
    function (error) {
      scanInProgress = false;
      errorCallback(error);
    },
    "ChaersiBarcodeScanner",
    "startCameraScan",
    []
  );
};

ChaersiBarcodeScanner.isCameraReady = function (
  successCallback,
  errorCallback
) {
  if (errorCallback == null) {
    errorCallback = function () {};
  }

  if (typeof errorCallback != "function") {
    console.log(
      "ChaersiBarcodeScanner.isCameraReady failure: failure parameter not a function"
    );
    return;
  }

  if (typeof successCallback != "function") {
    console.log(
      "ChaersiBarcodeScanner.isCameraReady failure: success callback parameter must be a function"
    );
    return;
  }

  exec(
    function (result) {
      successCallback(result);
    },
    function (error) {
      errorCallback(error);
    },
    "ChaersiBarcodeScanner",
    "isCameraReady",
    []
  );
};

ChaersiBarcodeScanner.cameraUnbind = function (successCallback, errorCallback) {
  if (errorCallback == null) {
    errorCallback = function () {};
  }

  if (typeof errorCallback != "function") {
    console.log(
      "ChaersiBarcodeScanner.cameraUnbind failure: failure parameter not a function"
    );
    return;
  }

  if (typeof successCallback != "function") {
    console.log(
      "ChaersiBarcodeScanner.cameraUnbind failure: success callback parameter must be a function"
    );
    return;
  }

  exec(
    function (result) {
      scanInProgress = false;
      successCallback(result);
    },
    function (error) {
      scanInProgress = true;
      errorCallback(error);
    },
    "ChaersiBarcodeScanner",
    "cameraUnbind",
    []
  );
};

module.exports = ChaersiBarcodeScanner;
