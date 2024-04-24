const { zip } = require('lodash');

class Env {
  constructor(outerEnv) {
    this.outerEnv = outerEnv;
    this.innerEnv = new Map();
  }

  static from(outerEnv, bindings, values) {
    const env = new Env(outerEnv);
    const bindingAndExprs = zip(bindings, values);
    bindingAndExprs.forEach(([key, value]) => env.set(key.value, value));
    return env;
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
