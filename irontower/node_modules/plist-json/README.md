# plist-json
scale-img based gm

## How to use
```js
var plist = require('plist-json');
plist.parse(plistFile, function(err, json) {
});

var plistStr = plist.build(json);

plist.save(destPlist, json, function(err));
```

## Installation
```sh
npm install --save plist-json
```

## Tests
```sh
npm install
npm test
```