// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

class Evaluator {
    evaluate(node){
        switch (node.type){
            case "Program":
                return this.evaluateProgram(node);
            case "LetDeclaration":
                return this.evaluateLetDeclaration(node);
            case "CallExpression":
                return this.evaluateCallExpression(node);
            case "NumberLiteral":
                return node.value;
            case "Identifier":
                throw new Error("Cannot evaluate identifier directly");
            case "BinaryExpression":
                switch (node.operator){
                    case "+":
                        return this.evaluate(node.left) + this.evaluate(node.right);
                    case "-":
                        return this.evaluate(node.left) - this.evaluate(node.right);
                    case "*":
                        return this.evaluate(node.left) * this.evaluate(node.right);
                    default:
                        throw new Error(`Unknown operator: ${node.operator}`);
                }
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    evaluateProgram(program){
        let lastResult = null;
        for (const statement of program.body){
            lastResult = this.evaluate(statement);
        }
        return lastResult;
    }

    evaluateLetDeclaration(node){
        return this.evaluate(node.value);
    }

    evaluateCallExpression(node){
        if (node.callee === "print"){
            const value = this.evaluate(node.arguments[0]);
            console.log(value);
            return value;
        }
        throw new Error(`Unknown function: ${node.callee}`);
    }
}

export default Evaluator;
