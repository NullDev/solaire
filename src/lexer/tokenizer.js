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

            if (char === '"'){
                this.current++;
                let str = "";
                while (this.current < this.input.length && this.input[this.current] !== '"'){
                    str += this.input[this.current++];
                }
                if (this.current >= this.input.length){
                    throw new SyntaxError("Unterminated string literal");
                }
                this.current++;
                this.tokens.push({ type: TokenType.String, value: str });
                continue;
            }

            if (char === "'"){
                this.current++;
                if (this.current >= this.input.length){
                    throw new SyntaxError("Unterminated character literal");
                }
                const charValue = this.input[this.current++];
                if (this.current >= this.input.length || this.input[this.current] !== "'"){
                    throw new SyntaxError("Unterminated character literal");
                }
                this.current++;
                this.tokens.push({ type: TokenType.Char, value: charValue });
                continue;
            }

            if (/[0-9]/.test(char)){
                let num = "";
                let hasDecimal = false;
                while (/[0-9]/.test(this.input[this.current]) || (this.input[this.current] === "." && !hasDecimal)){
                    if (this.input[this.current] === "."){
                        hasDecimal = true;
                    }
                    num += this.input[this.current++];
                }
                this.tokens.push({ type: TokenType.Number, value: Number(num) });
                continue;
            }

            if (char === "-"){
                // Check if this is a unary minus
                const prevToken = this.tokens[this.tokens.length - 1];
                if (!prevToken ||
                    prevToken.type === TokenType.LeftParen ||
                    prevToken.type === TokenType.Plus ||
                    prevToken.type === TokenType.Minus ||
                    prevToken.type === TokenType.Multiply){
                    this.tokens.push({ type: TokenType.UnaryMinus });
                }
                else {
                    this.tokens.push({ type: TokenType.Minus });
                }
                this.current++;
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
