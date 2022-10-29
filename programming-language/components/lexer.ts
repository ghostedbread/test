// LEXER.TS
// TYPE GUIDE:
// 0 = Number
// 1 = Identifier
// 2 = Equals
// 3 = VarDefine
// 4 = ConstVarDefine
// 5 = OpenParen
// 6 = CloseParen
// 7 = Operator
export enum TokenType {
    Number,
    Identifier,
    Equals,
    VarDefine,
    ConstVarDefine,
    OpenParen,
    CloseParen,
    Operator,
    EOF,
    Null
}
const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.VarDefine,
    var: TokenType.VarDefine,
    const: TokenType.ConstVarDefine,
    null: TokenType.Null,
}
export interface Token {
    value: string;
    type: TokenType;
}
function token (value = "", type: TokenType): Token {
    return { value, type };
}
function isalpha (src: string) {
    return src.toUpperCase() != src.toLowerCase()
}
function isskippable (str: string) {
    return str == ' ' || str == "\n" || str == '\t'
}
// if its too compilcated, just use regex :D
function isint (str: string) {
    const c = str.charCodeAt(0)
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1])
}
export function tokenize (sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    let src = sourceCode.split("");

    // Build each token until end of file
    while (src.length > 0) {
        if (src[0] == '(') {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
            tokens.push(token(src.shift(), TokenType.Operator));
        } else if (src[0] == "=") {
            tokens.push(token(src.shift(), TokenType.Equals));
        } else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else {
            // Handle multicharacter tokens (since were doin character by character)

            // build number tokens
            if (isint(src[0])) {
                let num = "";
                while (src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Number));
            } else if (isalpha(src[0])) {
                let identifier = "";
                while (src.length > 0 && isalpha(src[0])) {
                    identifier += src.shift();
                }
                // check for reserved keywords
                const reserved = KEYWORDS[identifier]
                if (typeof reserved == "number") {
                    tokens.push(token(identifier, reserved));
                } else {
                    tokens.push(token(identifier, TokenType.Identifier));
                }
            } else if (isskippable(src[0])) {
                src.shift()
            } else {
                console.log("Unrecognized character found in source: ", src[0], " [ Lexer Error ]")
                Deno.exit()
            }
        }
    }

    tokens.push({type: TokenType.EOF, value: "EndOfFile"})
    return tokens;
}
//const source = await Deno.readTextFile(Deno.args[0])
//for (const token of tokenize(source)) {
//    console.log(token)
//}