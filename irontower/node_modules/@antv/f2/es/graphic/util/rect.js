var Rect = {
  calcRotatedBox(_ref) {
    var {
      width,
      height,
      rotate
    } = _ref;
    var absRotate = Math.abs(rotate);
    return {
      width: Math.abs(width * Math.cos(absRotate) + height * Math.sin(absRotate)),
      height: Math.abs(height * Math.cos(absRotate) + width * Math.sin(absRotate))
    };
  }

};
export default Rect;