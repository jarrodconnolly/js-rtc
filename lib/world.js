const Intersect = require('./intersect');

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
    return xs.sort((a, b) => a.t - b.t);
  }

  shadeHit(comps) {
    return comps.object.material.lighting(this.light, comps.point, comps.eyev, comps.normalv);
  }
}

module.exports = World;
