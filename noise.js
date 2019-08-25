/* eslint-disable no-bitwise, no-param-reassign, func-names */
const ClassicalNoise = function () {
  this.grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];
  this.p = [];
  for (let i = 0; i < 256; i++) {
    this.p[i] = Math.floor(Math.random() * 256);
  }
  // To remove the need for index wrapping, double the permutation table length
  this.perm = [];
  for (let i = 0; i < 512; i++) {
    this.perm[i] = this.p[i & 255];
  }
};

ClassicalNoise.prototype.dot = function (g, x, y, z) {
  return g[0] * x + g[1] * y + g[2] * z;
};

ClassicalNoise.prototype.mix = function (a, b, t) {
  return (1.0 - t) * a + t * b;
};

ClassicalNoise.prototype.fade = function (t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
};

// Classic Perlin noise, 3D version
ClassicalNoise.prototype.noise = function (x, y, z) {
  // Find unit grid cell containing point
  let X = Math.floor(x);
  let Y = Math.floor(y);
  let Z = Math.floor(z);

  // Get relative xyz coordinates of point within that cell
  x -= X;
  y -= Y;
  z -= Z;

  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
  X &= 255;
  Y &= 255;
  Z &= 255;

  // Calculate a set of eight hashed gradient indices
  const gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
  const gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
  const gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
  const gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
  const gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
  const gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
  const gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
  const gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

  // Calculate noise contributions from each of the eight corners
  const n000 = this.dot(this.grad3[gi000], x, y, z);
  const n100 = this.dot(this.grad3[gi100], x - 1, y, z);
  const n010 = this.dot(this.grad3[gi010], x, y - 1, z);
  const n110 = this.dot(this.grad3[gi110], x - 1, y - 1, z);
  const n001 = this.dot(this.grad3[gi001], x, y, z - 1);
  const n101 = this.dot(this.grad3[gi101], x - 1, y, z - 1);
  const n011 = this.dot(this.grad3[gi011], x, y - 1, z - 1);
  const n111 = this.dot(this.grad3[gi111], x - 1, y - 1, z - 1);
  // Compute the fade curve value for each of x, y, z
  const u = this.fade(x);
  const v = this.fade(y);
  const w = this.fade(z);
  // Interpolate along x the contributions from each of the corners
  const nx00 = this.mix(n000, n100, u);
  const nx01 = this.mix(n001, n101, u);
  const nx10 = this.mix(n010, n110, u);
  const nx11 = this.mix(n011, n111, u);
  // Interpolate the four results along y
  const nxy0 = this.mix(nx00, nx10, v);
  const nxy1 = this.mix(nx01, nx11, v);
  // Interpolate the two last results along z
  const nxyz = this.mix(nxy0, nxy1, w);

  return nxyz;
};

module.exports = ClassicalNoise;
