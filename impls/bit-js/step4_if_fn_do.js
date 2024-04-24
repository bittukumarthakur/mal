const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { readStr } = require('./reader');
const { prStr } = require('./printer');
const { MalList, MalVector, MalHashMap, MalSymbol, MalNil, MalFn } = require('./types');
const { Env } = require('./env');
const { chunk } = require('lodash');
const { coreFn } = require('./core');

const rl = readline.createInterface({ input, output });
const READ = (value) => readStr(value);
const PRINT = (values) => prStr(values);

const evalAst = (ast, repelENV) => {
  switch (true) {
    case ast instanceof MalSymbol: {
      const value = repelENV.get(ast.value);
      if (!value) throw new Error(`${ast.value} => no value is found`);
      return value;
    }

    case ast instanceof MalList:
      return new MalList(ast.value.map((a) => EVAL(a, repelENV)));

    case ast instanceof MalVector:
      return new MalVector(ast.value.map((a) => EVAL(a, repelENV)));

    case ast instanceof MalHashMap:
      return new MalHashMap(ast.value.map((a) => EVAL(a, repelENV)));

    default:
      return ast;
  }
};

const evalList = (ast, repelENV) => {
  const [fn, ...params] = evalAst(ast, repelENV).value;

  if (fn instanceof MalFn) {
    const env = Env.from(fn.env, fn.binding.value, params);
    return EVAL(fn.exprs, env);
  }

  return fn.apply(null, params);
};

const EVAL = (ast, repelENV) => {
  // console.log('---->', ast);
  switch (true) {
    case !(ast instanceof MalList):
      return evalAst(ast, repelENV);

    case ast.value.length === 0:
      return ast;

    case ast.value[0].value === 'def!': {
      const [_, ...params] = ast.value;
      const [key, exp] = params;
      const value = EVAL(exp, repelENV);
      repelENV.set(key.value, value);

      return value;
    }

    case ast.value[0].value === 'let*': {
      const [_, ...params] = ast.value;
      const [binding, body] = params;
      const newEnv = new Env(repelENV);
      const bindingKeyAndValuePair = chunk(binding.value, 2);

      bindingKeyAndValuePair.forEach(([key, value]) =>
        newEnv.set(key.value, EVAL(value, newEnv))
      );

      return EVAL(body, newEnv);
    }

    case ast.value[0].value === 'do': {
      const [_, ...params] = ast.value;
      let value;
      for (const parm of params) value = EVAL(parm, repelENV);
      return value;
    }

    case ast.value[0].value === 'if': {
      const [_, cond, firstExp, secondExp] = ast.value;
      const evaluatedCond = EVAL(cond, repelENV).value;

      if (evaluatedCond === false || evaluatedCond === 'nil') {
        if (secondExp) return EVAL(secondExp, repelENV);

        return new MalNil();
      }

      return EVAL(firstExp, repelENV);
    }

    case ast.value[0].value === 'fn*': {
      const [_, ...params] = ast.value;
      const [binding, exprs] = params;

      return new MalFn(binding, exprs, repelENV);
    }

    default:
      return evalList(ast, repelENV);
  }
};

const repl = (repelENV) =>
  rl.question('user> ', (expString) => {
    try {
      PRINT(EVAL(READ(expString), repelENV));
    } catch (error) {
      console.log(error);
    }

    repl(repelENV);
  });

const main = () => {
  const repelENV = new Env();
  coreFn.forEach(([symbol, fn]) => repelENV.set(symbol, fn));
  repl(repelENV);
};

main();
