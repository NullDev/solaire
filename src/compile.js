import fs from "node:fs/promises";

import Tokenizer from "./lexer/tokenizer";
import Parser from "./parser/parser";
import Transpiler from "./transpiler/transpiler";
import Log from "./util/log";

const outputDir = "./out";

const cleanOutPutDir = async function(){
    if (await fs.exists(outputDir)){
        await fs.rm(outputDir, { recursive: true });
    }
    await fs.mkdir(outputDir);
};

const test = async function(input){
    await cleanOutPutDir();

    const tokenizer = new Tokenizer(input);
    const tokens = tokenizer.tokenize();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const transpiler = new Transpiler();
    const cCode = transpiler.transpile(ast);

    Log.info("Input:");
    Log.raw(input);
    Log.info("AST:");
    Log.raw(JSON.stringify(ast, null, 2));
    Log.info("C Code:");
    Log.raw(cCode);

    const fileName = `${outputDir}/output.c`;
    await fs.writeFile(fileName, cCode);
    Log.done(`C code saved to ${fileName}`);
};

test(`
let x = 3 + 4;
print(x * 2);
`);
