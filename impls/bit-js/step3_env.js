const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { readStr } = require('./reader');
const { prStr } = require('./printer');
const { MalList, MalNum, MalVector, MalHashMap, MalSymbol } = require('./types');
const { Env } = require('./env');

const rl = readline.createInterface({ input, output });
const READ = (value) => readStr(value);
const PRINT = (values) => prStr(values);

const repelENV = new Env();
repelENV.set('+', (a, b) => a + b);
repelENV.set('-', (a, b) => a - b);
repelENV.set('*', (a, b) => a * b);
repelENV.set('/', (a, b) => a / b);

const evalAst = (ast, repelENV) => {
  if (ast instanceof MalSymbol) {
    const value = repelENV.get(ast.value);
    if (!value) {
      throw new Error(`${ast.value} => no value is found`);
    }

    return value;
  }

  if (ast instanceof MalList) {
    return new MalList(ast.value.map((a) => EVAL(a, repelENV)));
  }

  if (ast instanceof MalVector) {
    return new MalVector(ast.value.map((a) => EVAL(a, repelENV)));
  }

  if (ast instanceof MalHashMap) {
    return new MalHashMap(ast.value.map((a) => EVAL(a, repelENV)));
  }

  return ast;
};

const EVAL = (ast, repelENV) => {
  if (!(ast instanceof MalList)) {
    return evalAst(ast, repelENV);
  }

  if (ast.value.length === 0) {
    return ast;
  }

  if (ast instanceof MalList) {
    if (ast.value[0].value === 'def!') {
      const [_, ...params] = ast.value;
      const key = params[0];
      const value = EVAL(params[1], repelENV);
      repelENV.set(key.value, value);

      return value;
    }

    const [fn, ...params] = evalAst(ast, repelENV).value;
    const args = params.map((a) => a.value);
    return new MalNum(fn.apply(null, args));
  }

  return evalAst(ast, repelENV);
};

const repl = () =>
  rl.question('user> ', (expString) => {
    try {
      PRINT(EVAL(READ(expString), repelENV));
    } catch (error) {
      console.log(error);
    }

    repl();
  });

repl();
