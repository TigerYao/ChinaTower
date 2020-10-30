"use strict";

exports.__esModule = true;
exports.beforeGeomInit = beforeGeomInit;

var _common = require("../util/common");

/**
 * filter the data out of scale' range
 */
function beforeGeomInit(chart) {
  chart.set('limitInPlot', true);
  var data = chart.get('filteredData');
  var colDefs = chart.get('colDefs');
  if (!colDefs) return data;
  var geoms = chart.get('geoms');
  var isSpecialGeom = false; // TODO

  (0, _common.each)(geoms, function (geom) {
    if (['area', 'line', 'path'].indexOf(geom.get('type')) !== -1) {
      isSpecialGeom = true;
      return false;
    }
  });
  var fields = [];
  (0, _common.each)(colDefs, function (def, key) {
    if (!isSpecialGeom && def && (def.values || def.min || def.max)) {
      fields.push(key);
    }
  });

  if (fields.length === 0) {
    return data;
  }

  var geomData = [];
  (0, _common.each)(data, function (obj) {
    var flag = true;
    (0, _common.each)(fields, function (field) {
      var value = obj[field];

      if (value) {
        var colDef = colDefs[field];

        if (colDef.type === 'timeCat') {
          var values = colDef.values;

          if ((0, _common.isNumber)(values[0])) {
            value = (0, _common.toTimeStamp)(value);
          }
        }

        if (colDef.values && colDef.values.indexOf(value) === -1 || colDef.min && value < colDef.min || colDef.max && value > colDef.max) {
          flag = false;
        }
      }
    });

    if (flag) {
      geomData.push(obj);
    }
  });
  chart.set('filteredData', geomData);
}