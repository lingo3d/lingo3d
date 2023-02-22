import Appendable from "../api/core/Appendable"
import IMathNode, {
    mathNodeDefaults,
    mathNodeSchema
} from "../interface/IMathNode"

const numbers = "0123456789._"
const operators = "+-*/="
const parentheses = "()"
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

const typeMap = new Map<
    string,
    "number" | "operator" | "parenthesis" | "letter"
>()
for (const char of numbers) typeMap.set(char, "number")
for (const char of operators) typeMap.set(char, "operator")
for (const char of parentheses) typeMap.set(char, "parenthesis")
for (const char of letters) typeMap.set(char, "letter")

class Token {
    public constructor(
        public type: "number" | "operator" | "parenthesis" | "letter",
        public value: string
    ) {}
}

export default class MathNode extends Appendable implements IMathNode {
    public static componentName = "mathNode"
    public static defaults = mathNodeDefaults
    public static schema = mathNodeSchema
    public static includeKeys = ["expression"]

    private _expression?: string
    public get expression() {
        return this._expression
    }
    public set expression(val) {
        this._expression = val
        if (!val) return

        let typeOld = ""
        let tokenValue = ""
        const tokens: Array<Token> = []
        for (const char of val) {
            if (char === " ") continue
            const type = typeMap.get(char)
            if (!type) {
                console.warn(
                    `invalid character "${char}" in expression "${val}"`
                )
                return
            }
            if (typeOld === type) tokenValue += char
            else if (tokenValue) {
                tokens.push(new Token(typeOld as any, tokenValue))
                tokenValue = char
            } else tokenValue = char
            typeOld = type
        }
        console.log(tokens)
    }

    public evaluate(scope?: Record<string, number>) {}
}
