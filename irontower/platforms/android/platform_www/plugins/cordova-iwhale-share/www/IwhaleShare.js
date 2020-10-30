cordova.define("cordova-iwhale-share.IwhaleShare", function(require, exports, module) {
var exec = require('cordova/exec');

// 分享第三方平台  arg0 :"QQ" , "Wechat" 。。。。
exports.share = function(arg0, success, error) {
  exec(success, error, 'IwhaleShare', 'share', [arg0]);
};

});
