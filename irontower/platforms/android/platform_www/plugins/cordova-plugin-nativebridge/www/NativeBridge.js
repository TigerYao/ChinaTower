cordova.define("cordova-plugin-nativebridge.NativeBridge", function(require, exports, module) {
var exec = require('cordova/exec');

exports.openScanQrcode = function (arg0, success, error) {
    exec(success, error, 'NativeBridge', 'openScanQrcode', [arg0]);
};

});
