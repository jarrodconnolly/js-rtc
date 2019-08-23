const Intersect = require('./intersect');
const Colour = require('./colour');
const Ray = require('./ray');

class World {
  constructor(light, objects) {
    this.objects = objects || [];
    this.light = light;
    this.shadowEnabled = true;
  }

  intersectWorld(ray) {
    const xs = [];
    this.objects.forEach((o) => {
      const xso = o.intersect(ray);
      xs.push(...xso);
    });
    return Intersect.intersections(...xs).sort((a, b) => a.t - b.t);
  }

  shadeHit(comps) {
    const shadowed = this.shadowEnabled && this.isShadowed(comps.overPoint);
    return comps.object.material.lighting(this.light, comps.point, comps.eyev, comps.normalv, shadowed);
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

  isShadowed(point) {
    const v = this.light.position.subtract(point);
    const distance = v.magnitude();
    const direction = v.normalize();

    const r = new Ray(point, direction);
    const xs = this.intersectWorld(r);

    const h = Intersect.hit(xs);
    if (h && h.t < distance) {
      return true;
    }

    return false;
  }
}

module.exports = World;
