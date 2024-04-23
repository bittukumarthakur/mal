class Env {
  constructor(outerEnv) {
    this.outerEnv = outerEnv;
    this.innerEnv = new Map();
  }

  set(key, malValue) {
    this.innerEnv.set(key, malValue);
  }

  find(key) {
    const value = this.innerEnv.get(key);

    if (value) return value;
    return this.outerEnv ? this.outerEnv.find(key) : null;
  }

  get(key) {
    const value = this.find(key);
    if (value) return value;
    throw new Error(`${key} not found`);
  }
}

module.exports = { Env };
