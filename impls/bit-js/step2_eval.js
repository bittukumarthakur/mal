const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { readStr } = require('./reader');
const { prStr } = require('./printer');
const { MalList, MalNum, MalVector, MalHashMap } = require('./types');

const rl = readline.createInterface({ input, output });
const READ = (value) => readStr(value);
const PRINT = (values) => prStr(values);

const repelENV = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
};

const evalAst = (ast, repelENV) => {
  if (ast.value.length === 0) {
    return ast;
  }

  if (ast instanceof MalList) {
    const [fn, ...params] = ast.value;
    const args = params.map((a) => evalAst(a, repelENV).value);
    const value = repelENV[fn.value].apply(null, args);

    return new MalNum(value);
  }

  if (ast instanceof MalVector) {
    return new MalVector(ast.value.map((a) => evalAst(a, repelENV)));
  }

  if (ast instanceof MalHashMap) {
    return new MalHashMap(ast.value.map((a) => evalAst(a, repelENV)));
  }

  return ast;
};

const EVAL = (ast, repelENV) => {
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
