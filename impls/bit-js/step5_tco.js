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

const handleDo = (ast, repelENV) => {
  const argsWithoutLast = ast.value.slice(1, -1);
  const [lastArgs] = ast.value.slice(-1);
  argsWithoutLast.forEach((expr) => EVAL(expr, repelENV));

  return lastArgs;
};

const handleLet = (ast, repelENV) => {
  const [_, bindings, body] = ast.value;
  const newEnv = new Env(repelENV);
  const bindingKeyAndValuePair = chunk(bindings.value, 2);
  bindingKeyAndValuePair.forEach(([key, value]) =>
    newEnv.set(key.value, EVAL(value, newEnv))
  );

  return { newAst: body, newEnv };
};

const handleDef = (ast, repelENV) => {
  const [_, ...params] = ast.value;
  const [key, exp] = params;
  const value = EVAL(exp, repelENV);
  repelENV.set(key.value, value);

  return value;
};

const handleIf = (ast, repelENV) => {
  const [_, cond, firstExp, secondExp] = ast.value;
  const evaluatedCond = EVAL(cond, repelENV).value;

  if (evaluatedCond === false || evaluatedCond === 'nil')
    return secondExp ? secondExp : new MalNil();

  return firstExp;
};

const EVAL = (ast, repelENV) => {
  while (true) {
    if (!(ast instanceof MalList)) return evalAst(ast, repelENV);
    if (ast.value.length === 0) return ast;

    switch (ast.value[0].value) {
      case 'def!':
        return handleDef(ast, repelENV);

      case 'let*': {
        const { newAst, newEnv } = handleLet(ast, repelENV);
        repelENV = newEnv;
        ast = newAst;
        break;
      }

      case 'do': {
        ast = handleDo(ast, repelENV);
        break;
      }

      case 'if': {
        ast = handleIf(ast, repelENV);
        break;
      }

      case 'fn*': {
        const [_, bindings, body] = ast.value;
        return new MalFn(bindings, body, repelENV);
      }

      default: {
        const [fn, ...params] = evalAst(ast, repelENV).value;

        if (fn instanceof MalFn) {
          repelENV = Env.from(fn.env, fn.binding.value, params);
          ast = fn.exprs;
        } else {
          return fn.apply(null, params);
        }
      }
    }
  }
};

const repl = (repelENV) =>
  rl.question('user> ', (expString) => {
    try {
      PRINT(EVAL(READ(expString), repelENV));
    } catch (error) {
      console.log(error.message);
    }

    repl(repelENV);
  });

const main = () => {
  const repelENV = new Env();
  Object.entries(coreFn).forEach(([symbol, fn]) => repelENV.set(symbol, fn));
  repl(repelENV);
};

main();
