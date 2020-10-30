cordova.define("cordova-iwhale-pay.IwhalePay", function(require, exports, module) {
var exec = require('cordova/exec');

//  支付
exports.pay = function(arg0, success, error) {
  exec(success, error, 'IwhalePay', 'pay', [arg0]);
};

// 退款功能
exports.unPay = function(arg0, success, error) {
  exec(success, error, 'IwhalePay', 'unPay', [arg0]);
};

});
