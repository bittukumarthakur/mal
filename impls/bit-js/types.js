class MalType {
  // #value;
  constructor(value) {
    this.value = value;
  }

  prStr() {
    return this.value.toString();
  }
}

class MalNum extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalType {
  constructor(value) {
    super(value);
  }

  prStr() {
    return '(' + this.value.map((x) => x.prStr()).join(' ') + ')';
  }
}

class MalVector extends MalType {
  constructor(value) {
    super(value);
  }

  prStr() {
    return '[' + this.value.map((x) => x.prStr()).join(' ') + ']';
  }
}

class MalHashMap extends MalType {
  constructor(value) {
    super(value);
  }

  prStr() {
    return '{' + this.value.map((x) => x.prStr()).join(' ') + '}';
  }
}

class MalString extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalSymbol extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalKeyword extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalBoolean extends MalType {
  constructor(value) {
    super(value);
  }
}

class MalNil extends MalType {
  constructor() {
    super('nil');
  }
}

class MalFn extends MalType {
  constructor(binding, exprs, env) {
    super('#<function>');
    this.binding = binding;
    this.exprs = exprs;
    this.env = env;
  }

  prStr() {
    return '#<function>';
  }
}

module.exports = {
  MalType,
  MalNum,
  MalList,
  MalSymbol,
  MalVector,
  MalHashMap,
  MalString,
  MalKeyword,
  MalBoolean,
  MalNil,
  MalFn,
};
