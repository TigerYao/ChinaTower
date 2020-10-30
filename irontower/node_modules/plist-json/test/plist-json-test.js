var fs = require('fs');
var del = require('del');
var expect = require('chai').expect;
var plist = require('../lib/plist-json.js');

var tmpPath = 'test/tmp-result-res';
describe('plist-json', function () {
  before(function () {
    del.sync(tmpPath);
    fs.mkdirSync(tmpPath);
  });

  it('parse plist', function (done) {
    plist.parse('test/res/firework.plist', function (err, json) {
      expect(err).not.exist;
      expect(json.textureFileName).to.equal('fireworks.png');
      expect(json.radialAccelVariance).to.equal(-51.5);
      done();
    });
  });

  it('parse bplist', function (done) {
    plist.parse('test/res/bplist.plist', function (err, json) {
      expect(err).not.exist;
      expect(json.HSP_HEARTBEAT_TIMEINTERVAL).to.equal(120);
      expect(json.HSP_USE_PUSH).to.be.true;
      plist.save(tmpPath + '/bplist-extracted.plist', json, function (err) {
        expect(err).not.exist;
        expect(fs.existsSync(tmpPath + '/bplist-extracted.plist')).to.be.true;
        done();
      });
    });
  });

  it('build', function () {
    var json = {
      x: 1,
      y: 2
    };

    var expectStr = ['<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
      '<plist version="1.0">',
      '  <dict>',
      '    <key>x</key>',
      '    <integer>1</integer>',
      '    <key>y</key>',
      '    <integer>2</integer>',
      '  </dict>',
      '</plist>'].join('\n');
    expect(plist.build(json)).to.equal(expectStr);
  });
});