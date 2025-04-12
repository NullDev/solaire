// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

class Transpiler {
    constructor(){
        this.output = [];
        this.variables = new Set();
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
        this.variables.add(node.name);
        this.output.push(`    int ${node.name} = ${value};`);
    }

    transpileCallExpression(node){
        if (node.callee === "print"){
            const argument = this.getExpressionValue(node.arguments[0]);
            this.output.push(`    printf("%d\\n", ${argument});`);
        }
        else {
            throw new Error(`Unknown function: ${node.callee}`);
        }
    }

    getExpressionValue(node){
        switch (node.type){
            case "NumberLiteral":
                return node.value;
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
}

export default Transpiler;
