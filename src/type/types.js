// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

// Primitive types
export const PrimitiveType = {
    Int: "Int",
    Float: "Float",
    Bool: "Bool",
    String: "String",
    Char: "Char",
    Void: "Void",
};

export class TypeSystem {
    constructor(){
        this.typeTable = new Map();
    }

    isValidType(type){
        if (typeof type === "string"){
            return Object.values(PrimitiveType).includes(type);
        }
        // TODO: Add support for custom types later
        return false;
    }

    inferType(value){
        if (typeof value === "number"){
            return Number.isInteger(value) ? PrimitiveType.Int : PrimitiveType.Float;
        }
        if (typeof value === "boolean"){
            return PrimitiveType.Bool;
        }
        if (typeof value === "string"){
            return value.length === 1 ? PrimitiveType.Char : PrimitiveType.String;
        }
        return null;
    }

    areTypesCompatible(type1, type2){
        // For now, only exact matches are compatible
        // TODO: Add type coercion rules later
        return type1 === type2;
    }

    addVariableType(name, type){
        if (!this.isValidType(type)){
            throw new Error(`Invalid type: ${type}`);
        }
        this.typeTable.set(name, type);
    }

    getVariableType(name){
        return this.typeTable.get(name);
    }
}
