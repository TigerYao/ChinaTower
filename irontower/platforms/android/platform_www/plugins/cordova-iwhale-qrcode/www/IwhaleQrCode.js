cordova.define("cordova-iwhale-qrcode.IwhaleQrCode", function(require, exports, module) {
var exec = require('cordova/exec');

exports.openScanQrcode = function(arg0, success, error) {
  exec(success, error, 'IwhaleQrCode', 'openScanQrcode', [arg0]);
};

});
