/**
 * filter the data out of scale' range
 */
import { each, isNumber, toTimeStamp } from '../util/common';

function beforeGeomInit(chart) {
  chart.set('limitInPlot', true);
  var data = chart.get('filteredData');
  var colDefs = chart.get('colDefs');
  if (!colDefs) return data;
  var geoms = chart.get('geoms');
  var isSpecialGeom = false; // TODO

  each(geoms, function (geom) {
    if (['area', 'line', 'path'].indexOf(geom.get('type')) !== -1) {
      isSpecialGeom = true;
      return false;
    }
  });
  var fields = [];
  each(colDefs, function (def, key) {
    if (!isSpecialGeom && def && (def.values || def.min || def.max)) {
      fields.push(key);
    }
  });

  if (fields.length === 0) {
    return data;
  }

  var geomData = [];
  each(data, function (obj) {
    var flag = true;
    each(fields, function (field) {
      var value = obj[field];

      if (value) {
        var colDef = colDefs[field];

        if (colDef.type === 'timeCat') {
          var values = colDef.values;

          if (isNumber(values[0])) {
            value = toTimeStamp(value);
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

export { beforeGeomInit };