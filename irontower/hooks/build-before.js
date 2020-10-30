#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const addLaunchStoryboardToPlist = filePath => {
  const resolvePath = path.join(__dirname, filePath);
const filePath = '../platforms/ios/TTHD/TTHD-Info.plist';
const resolvePath = path.join(__dirname, filePath);

const addLaunchStoryboardToPlist = () => {
  fs.readFile(resolvePath, (err, data) => {
    if (err) {
      console.error('读取文件路径错误', err, resolvePath);
      return;
    }
    let fileRead = data.toString();
    let index = fileRead.indexOf('<key>');
    fileRead = `${fileRead.slice(0, index)}<key>UILaunchStoryboardName</key>
    \t<string>CDVLaunchScreen</string>
    \t${fileRead.slice(index)}`;

    // 将'CFBundleDisplayName'的key也修改为'铁塔备电'
    const reg = /<key>CFBundleDisplayName<\/key>\s{1,}<string>\S{0,}<\/string>/;

    // 如果已经有CFBundleDisplayName就替换
    if (reg.test(fileRead)) {
      fileRead = fileRead.replace(
        reg,
        `<key>CFBundleDisplayName</key>
        \t<string>铁塔换电</string>`,
      );
    } else {
      // 否则就添加
      const index = fileRead.indexOf('<key>');
      fileRead = `${fileRead.slice(0, index)}<key>CFBundleDisplayName</key>
    \t<string>铁塔换电</string>
    \t${fileRead.slice(index)}`;
    }

    fs.writeFile(resolvePath, fileRead, function(err, data) {
      if (err) {
        console.error('修改配置失败', err);
        return;
      }
      console.log('✨✨✨✨✨✨🍻项目名称修改成功 🍻✨✨✨✨✨✨');
    });
  });
};

module.exports = function(context) {
  return new Promise(function(resolve) {
    addLaunchStoryboardToPlist('../platforms/ios/铁塔换电/铁塔换电-Info.plist');
    resolve();
  });
};
