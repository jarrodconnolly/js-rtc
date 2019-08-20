const Intersect = require('./intersect');
const Colour = require('./colour');

class World {
  constructor(light, objects) {
    this.objects = objects || [];
    this.light = light;
  }

  intersectWorld(ray) {
    const xs = [];
    this.objects.forEach((o) => {
      const xso = Intersect.intersect(o, ray);
      xs.push(...xso);
    });
    return Intersect.intersections(...xs).sort((a, b) => a.t - b.t);
  }

  shadeHit(comps) {
    return comps.object.material.lighting(this.light, comps.point, comps.eyev, comps.normalv);
  }

  colorAt(ray) {
    const xs = this.intersectWorld(ray);
    const hit = xs[0];
    if (!hit) {
      return new Colour(0, 0, 0);
    }
    const comps = Intersect.prepareComputations(xs[0], ray);
    return this.shadeHit(comps);
  }
}

module.exports = World;
