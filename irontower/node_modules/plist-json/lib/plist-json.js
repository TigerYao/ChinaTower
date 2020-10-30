var fs = require('fs');
var plist = require('plist');
var bplist = require('bplist-parser');
var log = require('debug')('plist-json');

exports.parse = function parse(file, cb) {
  log('parse: ' + file);
  var ctx = fs.readFileSync(file, 'utf8');
  if (ctx.slice(0, 'bplist'.length) === 'bplist') {
    bplist.parseFile(file, function (err, doc) {
      if (err) {
        log(new Error(err));
        cb && cb(err);
      } else {
        cb(null, doc[0]);
      }
    });
  } else {
    var json = plist.parse(ctx);
    cb && cb(null, json);
  }
};

exports.build = function build(json) {
  return plist.build(json);
};

exports.save = function save(file, json, cb) {
  fs.writeFile(file, plist.build(json), cb);
};