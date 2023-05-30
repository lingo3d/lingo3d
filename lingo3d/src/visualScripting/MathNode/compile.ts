import math from "../../math"
import { Token, TokenList } from "./tokenize"

export const extractParenthesisTree = (
    openCloseParenthesisTokens: Array<[Token, Token]>
) => {
    for (const [
        openParenthesisToken,
        closeParenthesisToken
    ] of openCloseParenthesisTokens) {
        const { prev } = openParenthesisToken
        if (prev?.type === "text")
            if (!(prev.value in math))
                throw new Error(`Invalid function call: ${prev.value}`)
            else prev.type = "function"

        const { next } = closeParenthesisToken
        closeParenthesisToken.prev = undefined
        closeParenthesisToken.next = undefined
        if (openParenthesisToken.next !== closeParenthesisToken)
            openParenthesisToken.linked = new TokenList(
                openParenthesisToken.next
            )
        openParenthesisToken.next = next
    }
}

export const compile = (tokenList: TokenList, varTokens: Array<Token>) => {
    let result = ""
    for (const token of tokenList) {
        if (token.type === "sign") result += " "
        else if (token.type === "function") result += "this.mathFn."
        else if (token.type === "text") {
            varTokens.push(token)
            result += "this.runtimeData."
        }
        result += token.value
        if (token.linked) result += compile(token.linked, varTokens)
    }
    return result
}
