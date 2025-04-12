// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

import { TokenType, BinaryOperators, Parentheses, Keywords } from "./tokens";

class Tokenizer {
    constructor(input){
        this.input = input;
        this.current = 0;
        this.tokens = [];
    }

    tokenize(){
        while (this.current < this.input.length){
            const char = this.input[this.current];

            if (/\s/.test(char)){
                this.current++;
                continue;
            }

            if (/[0-9]/.test(char)){
                let num = "";
                while (/[0-9]/.test(this.input[this.current])){
                    num += this.input[this.current++];
                }
                this.tokens.push({ type: TokenType.Number, value: Number(num) });
                continue;
            }

            if (char in BinaryOperators){
                this.tokens.push({ type: BinaryOperators[char] });
                this.current++;
                continue;
            }

            if (char in Parentheses){
                this.tokens.push({ type: Parentheses[char] });
                this.current++;
                continue;
            }

            if (char === ";"){
                this.tokens.push({ type: TokenType.Semicolon });
                this.current++;
                continue;
            }

            if (char === ":"){
                this.tokens.push({ type: TokenType.Colon });
                this.current++;
                continue;
            }

            if (/[a-zA-Z_]/.test(char)){
                let identifier = "";
                while (/[a-zA-Z0-9_]/.test(this.input[this.current])){
                    identifier += this.input[this.current++];
                }

                if (identifier in Keywords){
                    this.tokens.push({ type: Keywords[identifier] });
                }
                else {
                    this.tokens.push({ type: TokenType.Identifier, value: identifier });
                }
                continue;
            }

            throw new SyntaxError(`Unexpected character: '${char}'`);
        }

        return this.tokens;
    }
}

export default Tokenizer;
