class Profile {
  constructor() {
    this.data = {};
  }

  increment(name) {
    if (!this.data[name]) {
      this.data[name] = 1;
    } else {
      this.data[name] += 1;
    }
  }

  output() {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(this.data, null, 2));
  }
}

module.exports = new Profile();
