var exec = require('cordova/exec');

// 支付
exports.pay = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'pay', [arg0]);
};

// 分享
exports.share = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'share', [arg0]);
};

// 设置激光推送标识
exports.setJpushAlias = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'setJpushAlias', [arg0]);
};

// 清空激光推送标识
exports.clearJpushAlias = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'clearJpushAlias', [arg0]);
};

// 播放视频
exports.playVideo = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'playVideo', [arg0]);
};

// 播放音频
exports.playMedia = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'playMedia', [arg0]);
};

// 调用wkwebview页面
exports.pushWebviewWithUrl = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'pushWebviewWithUrl', [arg0]);
};

// 跳转到其他地图平台 如：百度，高德
exports.goOtherMap = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'goOtherMap', [arg0]);
};

// 打开扫描功能
exports.scanQRCode = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'scanQRCode', [arg0]);
};

// 打开蚂蚁金服信用
exports.openAntFi = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'openAntFi', [arg0]);
};
// 打开地图导航功能
exports.openMapApp = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'openMapApp', [arg0]);
};

// 调用原生的公用方法
exports.commonFunc = function(arg0, success, error) {
  exec(success, error, 'H5Bridge', 'commonFunc', [arg0]);
};
