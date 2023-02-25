const numbers = "0123456789._"
const operators = "+-*/="
const parentheses = "()"
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

type Type = "number" | "operator" | "parenthesis" | "letter" | "whitespace"
type TokenType =
    | "number"
    | "operator"
    | "sign"
    | "parenthesis"
    | "text"
    | "function"

const typeMap = new Map<string, Type>()
for (const char of numbers) typeMap.set(char, "number")
for (const char of operators) typeMap.set(char, "operator")
for (const char of parentheses) typeMap.set(char, "parenthesis")
for (const char of letters) typeMap.set(char, "letter")
typeMap.set(" ", "whitespace")

const mapTokenType = (type: Type | undefined) => {
    switch (type) {
        case "number":
            return "number"
        case "operator":
            return "operator"
        case "parenthesis":
            return "parenthesis"
        case "letter":
            return "text"
        default:
            throw new Error(`Invalid type: ${type}`)
    }
}

export class Token {
    public next?: Token
    public linked?: TokenList
    public constructor(
        public type: TokenType,
        public value: string,
        public prev?: Token
    ) {}
}

class TokenIterator implements Iterator<Token> {
    public constructor(private current?: Token) {}

    public next(): IteratorResult<Token> {
        if (this.current) {
            const { current } = this
            this.current = this.current.next
            return { done: false, value: current }
        }
        return { done: true, value: undefined }
    }
}

export class TokenList implements Iterable<Token> {
    public constructor(public first?: Token) {}
    public [Symbol.iterator]() {
        return new TokenIterator(this.first)
    }
}

const validOperators = new Set(["+", "-", "*", "**", "/", "%", "="])

const isPlusOrMinus = (val: string): val is "+" | "-" =>
    val === "+" || val === "-"

export const tokenize = (val: string, tokenList: TokenList) => {
    let typeOld: Type | undefined
    let tokenOld: Token | undefined
    let tokenValue = ""
    let openParentheses = 0
    const openParenthesisStack: Array<Token> = []
    const openCloseParenthesisTokens: Array<[Token, Token]> = []
    for (const char of val + "(") {
        const type = typeMap.get(char)
        if (!type) throw new Error(`Invalid character: ${char}`)
        if (
            typeOld === type &&
            type !== "parenthesis" &&
            !isPlusOrMinus(tokenValue)
        )
            tokenValue += char
        else if (tokenValue) {
            if (typeOld === "number" && isNaN(Number(tokenValue)))
                throw new Error(`Invalid number: ${tokenValue}`)
            if (typeOld === "operator" && !validOperators.has(tokenValue))
                throw new Error(`Invalid operator: ${tokenValue}`)
            if (typeOld !== "whitespace") {
                const token = new Token(
                    mapTokenType(typeOld),
                    tokenValue,
                    tokenOld
                )
                if (
                    token.type === tokenOld?.type &&
                    token.type !== "parenthesis" &&
                    !isPlusOrMinus(token.value)
                )
                    throw new Error(`Unexpected token: ${tokenValue}`)

                if (
                    tokenOld?.type === "sign" &&
                    !(
                        token.type === "number" ||
                        token.type === "parenthesis" ||
                        token.type === "text"
                    )
                )
                    throw new Error(`Unexpected token: ${tokenValue}`)

                if (
                    tokenOld?.value === ")" &&
                    token.type !== "operator" &&
                    token.value !== ")"
                )
                    throw new Error(`Unexpected token: ${tokenValue}`)

                if (token.type === "parenthesis")
                    if (token.value === "(") {
                        if (tokenOld?.type === "number")
                            throw new Error(`Unexpected token: ${tokenValue}`)
                        openParentheses++
                        openParenthesisStack.push(token)
                    } else if (token.value === ")") {
                        if (tokenOld?.type === "operator")
                            throw new Error(`Unexpected token: ${tokenValue}`)
                        if (--openParentheses < 0)
                            throw new Error(`Unexpected token: ${tokenValue}`)
                        const openParenthesisToken = openParenthesisStack.pop()
                        if (!openParenthesisToken)
                            throw new Error(`Unexpected token: ${tokenValue}`)
                        openCloseParenthesisTokens.push([
                            openParenthesisToken,
                            token
                        ])
                    }
                if (
                    token.type === "operator" &&
                    isPlusOrMinus(token.value) &&
                    (!tokenOld ||
                        tokenOld.type === "parenthesis" ||
                        tokenOld.type === "operator")
                )
                    token.type = "sign"

                if (tokenOld) tokenOld.next = token
                tokenOld = token
                tokenList.first ??= token
            }
            tokenValue = char
        } else tokenValue = char
        typeOld = type
    }
    if (openParentheses !== 0) throw new Error("Unbalanced parentheses")
    return openCloseParenthesisTokens
}
