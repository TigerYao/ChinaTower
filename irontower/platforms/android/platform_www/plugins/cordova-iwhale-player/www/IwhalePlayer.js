cordova.define("cordova-iwhale-player.IwhalePlayer", function(require, exports, module) {
var exec = require('cordova/exec');
// 播放音频文件  主要是播放本地文件 用于推送完成后开始播放
exports.playMedia = function(arg0, success, error) {
    exec(success, error, 'IwhalePlayer', 'playMedia', [arg0]);
};
  
// 播放视频文件 在线播放
exports.playVideo = function(arg0, success, error) {
    exec(success, error, 'IwhalePlayer', 'playVideo', [arg0]);
};
  

});
