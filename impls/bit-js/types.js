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

module.exports = {
  MalType,
  MalNum,
  MalList,
  MalSymbol,
  MalVector,
  MalHashMap,
  MalString,
  MalKeyword,
};
