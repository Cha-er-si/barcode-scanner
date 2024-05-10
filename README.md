# Barcode Scanner Plugin

A cordova plugin for Ionic with a fragment of barcode scanner camera activity. It is only available for android as of now, use [phonegap-plugin-barcodescanner](https://github.com/phonegap/phonegap-plugin-barcodescanner) for iOS.

## Installation

Add barcode scanner plugin in your project

```
ionic cordova plugin add https://github.com/Cha-er-si/barcode-scanner-plugin.git --link
```

Install the wrapper for the barcode scanner plugin

```
npm install https://github.com/Cha-er-si/awesome-cordova-plugins-chaersi-barcodescanner.git
```

If you want other version of the wrapper

```
npm install https://github.com/Cha-er-si/awesome-cordova-plugins-chaersi-barcodescanner.git#<Version Number>
```

## Usage/Examples

Import the barcode scanner.

```javascript
import { ChaersiBarcodeScanner } from "@awesome-cordova-plugins/chaersi-barcode-scanner/ngx";
```

Add a constructor for the barcode scanner.

```javascript
 constructor(private customBarcodeScanner: ChaersiBarcodeScanner) {}
```

Add it on ngOnInit.

```javascript
  ngOnInit() {
    this.platform.ready().then(() => {
      this.customBarcodeScanner
        .startCameraScan()
        .then((result) => {
          console.log({ result });
        })
        .catch((error) => {
          console.error({ error });
        });
    });
  }
```

You are free to do what you need from the result.

### Important Note

Take note that your ionic should disable the dark mode styles and that the ion-content should have a transparent background.
