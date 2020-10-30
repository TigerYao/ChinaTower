import { Scale, getScale, registerTickMethod, getTickMethod } from '@antv/scale';
import CatTick from './cat-tick';
import LinearTick from './linear-tick';
var Linear = getScale('linear');
var Identity = getScale('identity');
var Category = getScale('category');
var TimeCat = getScale('timeCat'); // 覆盖0.3.x的 cat 方法

registerTickMethod('cat', CatTick);
registerTickMethod('time-cat', CatTick); // 覆盖linear 度量的tick算法

registerTickMethod('wilkinson-extended', LinearTick);
Scale.Linear = Linear;
Scale.Identity = Identity;
Scale.Category = Category;
Scale.Cat = Category;
Scale.TimeCat = TimeCat;
export default Scale;
export { getScale, getTickMethod };