import Global from './global';
import Chart from './chart/chart';
import Shape from './geom/shape/shape';
import * as G from './graphic/index';
import * as Util from './util/common';
import * as Helper from './util/helper';

var track = function track() {
  return null;
};

var version = Global.version;
export { Global, version, Chart, Shape, G, Util, Helper, track };