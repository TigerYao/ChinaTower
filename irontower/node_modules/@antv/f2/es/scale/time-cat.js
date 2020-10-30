import { getScale, registerTickMethod } from '@antv/scale';
import CatTick from './cat-tick';
registerTickMethod('time-cat', CatTick);
var TimeCat = getScale('timeCat');
export default TimeCat;