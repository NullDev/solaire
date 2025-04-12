// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

export const TokenType = {
    Number: "Number",
    Plus: "Plus",
    Minus: "Minus",
    Multiply: "Multiply",
    LeftParen: "LeftParen",
    RightParen: "RightParen",
    Let: "Let",
    Identifier: "Identifier",
    Print: "Print",
    Semicolon: "Semicolon",
    Colon: "Colon",
    Equals: "Equals",
};

export const BinaryOperators = {
    "+": TokenType.Plus,
    "-": TokenType.Minus,
    "*": TokenType.Multiply,
    "=": TokenType.Equals,
};

export const Keywords = {
    let: TokenType.Let,
    print: TokenType.Print,
};

export const Parentheses = {
    "(": TokenType.LeftParen,
    ")": TokenType.RightParen,
};

export const isBinaryOperator = (token) => {
    return token && Object.values(BinaryOperators).includes(token.type);
};

export const getOperatorSymbol = (tokenType) => {
    // eslint-disable-next-line no-unused-vars
    return Object.entries(BinaryOperators).find(([_, type]) => type === tokenType)?.[0];
};
