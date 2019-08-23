class Intersect {
  static intersection(t, shape) {
    return {
      t: t,
      object: shape,
    };
  }

  static intersections(...rest) {
    return rest.filter((i) => i.t >= 0);
  }

  static hit(xs) {
    return xs.sort((a, b) => a.t - b.t)[0];
  }

  static prepareComputations(intersection, ray) {
    const comps = {};
    comps.t = intersection.t;
    comps.object = intersection.object;
    comps.point = ray.position(comps.t);
    comps.eyev = ray.direction.negate();
    comps.normalv = comps.object.normalAt(comps.point);
    if (comps.normalv.dotProduct(comps.eyev) < 0) {
      comps.inside = true;
      comps.normalv = comps.normalv.multiply(-1);
    } else {
      comps.inside = false;
    }
    // TODO: something up here. book says * EPSILON ? I had to * 20000
    // I see examples using 0.000001 here for EPSILON
    comps.overPoint = comps.point.add(comps.normalv.multiply(Number.EPSILON * 20000));
    return comps;
  }
}

module.exports = Intersect;
