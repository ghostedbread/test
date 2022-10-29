import { Statement, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral } from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    
    private tokens: Token[] = [];
    private not_eof (): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }
    
    public produceAST (sourceCode: string): Program {
        this.tokens = tokenize(sourceCode)
        const program: Program = {
            kind: "Program",
            body: []
        };
        
        // Parse until end of file.
        while (this.not_eof()) {
            program.body.push(this.parse_statement())
        }
        
        return program
    }
    
    private at() {
        return this.tokens[0] as Token;
    }
    
    private eat () {
        const prev = this.tokens.shift() as Token;
        return prev
    }
    
    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
            Deno.exit(1);
        }
        
        return prev;
    }
    
    private parse_statement (): Statement {
        return this.parse_expr()
    }
    
    private parse_expr (): Expr {
        return this.parse_additive_expr()
    }
    
    // handles + and - operators
    private parse_additive_expr (): Expr {
        let left = this.parse_multiplicative_expr() // something about prescidence ¯\_(ツ)_/¯
        
        while (this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
            
        }
        return left;
    }
    // handles multiplicative stuff like *, / and %
    private parse_multiplicative_expr (): Expr {
        let left = this.parse_primary_expr()
        
        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parse_primary_expr()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
            
        }
        return left;
    }
    private parse_primary_expr (): Expr {
        const tk = this.at().type;
        
        switch (tk) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;
            case TokenType.Null:
                this.eat();
                return {kind: "NullLiteral", value: "null" } as NullLiteral;
            case TokenType.OpenParen: {
                this.eat(); // eat the opening paren
                const value = this.parse_expr();
                this.expect(
                    TokenType.CloseParen,
                    "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
                    ); // closing paren
                    return value;
                }
                default:
                console.error("Unexpected token while parsing: ", this.at(), " [ Parser Error ]")
                Deno.exit(1)
            }
        }
    }