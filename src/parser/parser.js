// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

import { TokenType, isBinaryOperator, getOperatorSymbol } from "../lexer/tokens";

class Parser {
    constructor(tokens){
        this.tokens = tokens;
        this.current = 0;
    }

    parse(){
        const program = {
            type: "Program",
            body: [],
        };

        while (this.current < this.tokens.length){
            // @ts-ignore
            program.body.push(this.parseStatement());
        }

        return program;
    }

    parseStatement(){
        const token = this.tokens[this.current];

        if (token.type === TokenType.Let){
            return this.parseLetDeclaration();
        }

        if (token.type === TokenType.Print){
            return this.parsePrintStatement();
        }

        throw new SyntaxError(`Unexpected token: ${token.type}`);
    }

    parseLetDeclaration(){
        this.current++; // Consume 'let'

        const name = this.tokens[this.current];
        if (name?.type !== TokenType.Identifier){
            throw new SyntaxError("Expected identifier after 'let'");
        }
        this.current++;

        let annotation = null;
        if (this.tokens[this.current]?.type === TokenType.Colon){
            this.current++;
            const typeToken = this.tokens[this.current];
            if (typeToken?.type !== TokenType.Identifier){
                throw new SyntaxError("Expected type annotation after ':'");
            }
            annotation = typeToken.value;
            this.current++;
        }

        if (this.tokens[this.current]?.type !== TokenType.Equals){
            throw new SyntaxError("Expected '=' after identifier");
        }
        this.current++;

        const value = this.parseExpression();

        if (this.tokens[this.current]?.type !== TokenType.Semicolon){
            throw new SyntaxError("Expected ';' after let declaration");
        }
        this.current++;

        return {
            type: "LetDeclaration",
            name: name.value,
            value,
            annotation,
        };
    }

    parsePrintStatement(){
        this.current++; // Consume 'print'

        if (this.tokens[this.current]?.type !== TokenType.LeftParen){
            throw new SyntaxError("Expected '(' after 'print'");
        }
        this.current++;

        const argument = this.parseExpression();

        if (this.tokens[this.current]?.type !== TokenType.RightParen){
            throw new SyntaxError("Expected ')' after print argument");
        }
        this.current++;

        if (this.tokens[this.current]?.type !== TokenType.Semicolon){
            throw new SyntaxError("Expected ';' after print statement");
        }
        this.current++;

        return {
            type: "CallExpression",
            callee: "print",
            arguments: [argument],
        };
    }

    parseExpression(){
        let node = this.parseTerm();

        while (isBinaryOperator(this.tokens[this.current]) && (this.tokens[this.current].type === TokenType.Plus ||  this.tokens[this.current].type === TokenType.Minus)){
            const operator = getOperatorSymbol(this.tokens[this.current].type);
            this.current++;
            const right = this.parseTerm();
            node = {
                type: "BinaryExpression",
                operator,
                left: node,
                right,
                value: undefined,
            };
        }

        return node;
    }

    parseTerm(){
        let node = this.parseFactor();

        while (isBinaryOperator(this.tokens[this.current]) && this.tokens[this.current].type === TokenType.Multiply){
            const operator = getOperatorSymbol(this.tokens[this.current].type);
            this.current++;
            const right = this.parseFactor();
            node = {
                type: "BinaryExpression",
                operator,
                left: node,
                right,
                value: undefined,
            };
        }

        return node;
    }

    parseFactor(){
        const token = this.tokens[this.current];

        if (token?.type === TokenType.LeftParen){
            this.current++;
            const expression = this.parseExpression();
            if (this.tokens[this.current]?.type !== TokenType.RightParen){
                throw new SyntaxError("Expected closing parenthesis");
            }
            this.current++;
            return expression;
        }

        if (token?.type === TokenType.Number){
            this.current++;
            return {
                type: "NumberLiteral",
                value: token.value,
            };
        }

        if (token?.type === TokenType.Identifier){
            this.current++;
            return {
                type: "Identifier",
                name: token.value,
            };
        }

        throw new SyntaxError(`Expected number, identifier, or '(', got ${token?.type}`);
    }

    match(type){
        if (this.tokens[this.current]?.type === type){
            this.current++;
            return true;
        }
        return false;
    }
}

export default Parser;
