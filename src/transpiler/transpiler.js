// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

import { PrimitiveType } from "../type/types";

class Transpiler {
    constructor(){
        this.output = [];
        this.variables = new Map();
    }

    transpile(ast){
        this.output = [];
        this.variables.clear();
        this.emitHeader();
        this.emitMainStart();

        for (const statement of ast.body){
            this.transpileNode(statement);
        }

        this.emitMainEnd();
        return this.output.join("\n");
    }

    emitHeader(){
        this.output.push("#include <stdio.h>");
        this.output.push("#include <stdlib.h>");
        this.output.push("#include <stdbool.h>");
        this.output.push("");
    }

    emitMainStart(){
        this.output.push("int main() {");
    }

    emitMainEnd(){
        this.output.push("    return 0;");
        this.output.push("}");
    }

    transpileNode(node){
        switch (node.type){
            case "LetDeclaration":
                this.transpileLetDeclaration(node);
                break;
            case "CallExpression":
                this.transpileCallExpression(node);
                break;
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    transpileLetDeclaration(node){
        const value = this.getExpressionValue(node.value);
        const type = node.annotation || this.inferType(node.value);
        this.variables.set(node.name, type);
        const cType = this.getCType(type);
        this.output.push(`    ${cType} ${node.name} = ${value};`);
    }

    transpileCallExpression(node){
        if (node.callee === "print"){
            const argument = this.getExpressionValue(node.arguments[0]);
            const type = this.inferType(node.arguments[0]);
            const formatSpecifier = this.getFormatSpecifier(type);
            this.output.push(`    printf("${formatSpecifier}\\n", ${argument});`);
        }
        else {
            throw new Error(`Unknown function: ${node.callee}`);
        }
    }

    getExpressionValue(node){
        switch (node.type){
            case "NumberLiteral":
                return node.value;
            case "StringLiteral":
                return `"${node.value}"`;
            case "CharLiteral":
                return `'${node.value}'`;
            case "BooleanLiteral":
                return node.value ? "true" : "false";
            case "Identifier":
                if (!this.variables.has(node.name)){
                    throw new Error(`Undefined variable: ${node.name}`);
                }
                return node.name;
            case "BinaryExpression":
                const left = this.getExpressionValue(node.left);
                const right = this.getExpressionValue(node.right);
                const operator = this.getCOperator(node.operator);
                return `(${left} ${operator} ${right})`;
            case "UnaryExpression":
                const operand = this.getExpressionValue(node.right);
                return `(-${operand})`;
            default:
                throw new Error(`Unknown expression type: ${node.type}`);
        }
    }

    getCOperator(operator){
        switch (operator){
            case "+": return "+";
            case "-": return "-";
            case "*": return "*";
            default: throw new Error(`Unknown operator: ${operator}`);
        }
    }

    getCType(solaireType){
        switch (solaireType){
            case PrimitiveType.Int:
                return "int";
            case PrimitiveType.Float:
                return "float";
            case PrimitiveType.Bool:
                return "bool";
            case PrimitiveType.String:
                return "char*";
            case PrimitiveType.Char:
                return "char";
            default:
                throw new Error(`Unsupported type: ${solaireType}`);
        }
    }

    getFormatSpecifier(type){
        switch (type){
            case PrimitiveType.Int:
                return "%d";
            case PrimitiveType.Float:
                return "%f";
            case PrimitiveType.Bool:
                return "%d"; // bool is printed as int in C
            case PrimitiveType.String:
                return "%s";
            case PrimitiveType.Char:
                return "%c";
            default:
                throw new Error(`Unsupported type: ${type}`);
        }
    }

    inferType(node){
        switch (node.type){
            case "NumberLiteral":
                return Number.isInteger(node.value) ? PrimitiveType.Int : PrimitiveType.Float;
            case "StringLiteral":
                return PrimitiveType.String;
            case "CharLiteral":
                return PrimitiveType.Char;
            case "BooleanLiteral":
                return PrimitiveType.Bool;
            case "Identifier":
                if (this.variables.has(node.name)){
                    return this.variables.get(node.name);
                }
                throw new Error(`Cannot infer type: variable ${node.name} not found`);
            case "BinaryExpression":
                const leftType = this.inferType(node.left);
                const rightType = this.inferType(node.right);
                // For now, we'll use the left type as the result type
                // TODO: Add proper type coercion rules later
                if (leftType === rightType){
                    return leftType;
                }
                // If one is float and the other is int, promote to float
                if ((leftType === PrimitiveType.Float && rightType === PrimitiveType.Int) ||
                    (leftType === PrimitiveType.Int && rightType === PrimitiveType.Float)){
                    return PrimitiveType.Float;
                }
                throw new Error(`Type mismatch in binary expression: ${leftType} and ${rightType}`);
            case "UnaryExpression":
                return this.inferType(node.right);
            default:
                throw new Error(`Cannot infer type for node: ${node.type}`);
        }
    }
}

export default Transpiler;
