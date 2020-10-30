cordova.define("cordova-plugin-h5Bridge.cordova-plugin-h5Bridge", function(require, exports, module) {
var exec = require('cordova/exec');

exports.coolMethod = function (arg0, success, error) {
    exec(success, error, 'cordova-plugin-h5Bridge', 'coolMethod', [arg0]);
};

});
