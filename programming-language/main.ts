import Parser from './components/parser.ts'
import { evaluate } from "./runtime/interpreter.ts";
if (Deno.args[0]) {
    const parser = new Parser()
    const source = await Deno.readTextFile(Deno.args[0])
    const program = parser.produceAST(source);
    const result = evaluate(program);
    console.log(result);
} else {
    input()
    async function input () {
        const parser = new Parser()
        console.log("ES7 v0.01")
        while (true) {
            let input = prompt(">")
            if (input == "exit") {
                Deno.exit(1)
            }
            if (!input) {
                input = "\n" // prevent lexer from an error, since "":split("") returns nill
            }
            const program = parser.produceAST(input);

            const result = evaluate(program);
            console.log(result);
        }
    }
}