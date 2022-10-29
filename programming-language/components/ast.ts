// deno-lint-ignore-file no-empty-interface
export type NodeType = 
 | "Program" 
 | "NumericLiteral" 
 | "Identifier" 
 | "BinaryExpr"
 | "NullLiteral";
// | "CallExpr"
// | "UnaryExpr"
// | "FunctionDeclaration";
// statements will NOT return a value.
// let x = if (blah blah blah) { ... } is not valid. (anti-rust propoganda!1!)
export interface Statement {
    kind: NodeType;
}

// the file
export interface Program extends Statement {
    kind: "Program",
    body: Statement[];
}

export interface Expr extends Statement {} // ratio typescript

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr",
    left: Expr;
    right: Expr;
    operator: string;
}

export interface Identifier extends Expr {
    kind: "Identifier"
    symbol: string;
}
export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}
export interface NullLiteral extends Expr {
    kind: "NullLiteral";
    value: "null";
}