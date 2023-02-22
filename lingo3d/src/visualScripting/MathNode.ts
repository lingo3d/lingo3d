import { mapRange, Point3d } from "@lincode/math"
import { assert, random } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import IMathNode, {
    mathNodeDefaults,
    mathNodeSchema
} from "../interface/IMathNode"

const numbers = "0123456789._"
const operators = "+-*/="
const parentheses = "()"
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

type Type = "number" | "operator" | "parenthesis" | "letter" | "whitespace"
type TokenType = "number" | "operator" | "sign" | "parenthesis" | "text"

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

class Token {
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

class TokenList implements Iterable<Token> {
    public constructor(public first?: Token) {}
    public [Symbol.iterator]() {
        return new TokenIterator(this.first)
    }
}

const validOperators = new Set(["+", "-", "*", "**", "/", "%", "="])
const functions = new Map(
    Object.entries({
        abs: Math.abs,
        log: Math.log,
        sqrt: Math.sqrt,
        min: Math.min,
        max: Math.max,
        randomRange: random,
        mapRange: mapRange,
        ceil: Math.ceil,
        floor: Math.floor,
        round: Math.round,
        sign: Math.sign,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        asin: Math.asin,
        acos: Math.acos,
        atan: Math.atan,
        atan2: Math.atan2,
        radToDeg: (rad: number) => rad * (180 / Math.PI),
        degToRad: (deg: number) => deg * (Math.PI / 180),
        mToCM: (m: number) => m * 100,
        cmToM: (cm: number) => cm / 100,
        lerp: (a: number, b: number, t: number) => a + (b - a) * t,
        inverseLerp: (a: number, b: number, t: number) => (t - a) / (b - a),
        smoothStep: (a: number, b: number, t: number) =>
            t * t * (3 - 2 * t) * (b - a) + a,
        clamp: (val: number, min: number, max: number) =>
            Math.min(Math.max(val, min), max),
        fraction: (val: number) => val - Math.floor(val),
        trunc: (val: number) => Math.trunc(val),
        cross: (a: Point3d, b: Point3d) =>
            new Point3d(
                a.y * b.z - a.z * b.y,
                a.z * b.x - a.x * b.z,
                a.x * b.y - a.y * b.x
            ),
        dot: (a: Point3d, b: Point3d) => a.x * b.x + a.y * b.y + a.z * b.z,
        length: (a: Point3d) => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z),
        distance: (a: Point3d, b: Point3d) =>
            Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2),
        normalize: (a: Point3d) => {
            const length = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
            return new Point3d(a.x / length, a.y / length, a.z / length)
        },
        reflect: (a: Point3d, b: Point3d) => {
            const dot = a.x * b.x + a.y * b.y + a.z * b.z
            return new Point3d(
                a.x - 2 * dot * b.x,
                a.y - 2 * dot * b.y,
                a.z - 2 * dot * b.z
            )
        },
        project: (a: Point3d, b: Point3d) => {
            const dot = a.x * b.x + a.y * b.y + a.z * b.z
            return new Point3d(dot * b.x, dot * b.y, dot * b.z)
        },
        angle: (a: Point3d, b: Point3d) => {
            const dot = a.x * b.x + a.y * b.y + a.z * b.z
            const length =
                Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z) *
                Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z)
            return Math.acos(dot / length)
        },
        rotate: (a: Point3d, axis: Point3d, angle: number) => {
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            const dot = a.x * axis.x + a.y * axis.y + a.z * axis.z
            return new Point3d(
                (a.x - axis.x * dot) * cos +
                    dot * axis.x +
                    (-axis.z * a.y + axis.y * a.z) * sin,
                (a.y - axis.y * dot) * cos +
                    dot * axis.y +
                    (axis.z * a.x - axis.x * a.z) * sin,
                (a.z - axis.z * dot) * cos +
                    dot * axis.z +
                    (-axis.y * a.x + axis.x * a.y) * sin
            )
        },
        rotateX: (a: Point3d, angle: number) => {
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            return new Point3d(
                a.x,
                a.y * cos - a.z * sin,
                a.y * sin + a.z * cos
            )
        },
        rotateY: (a: Point3d, angle: number) => {
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            return new Point3d(
                a.x * cos + a.z * sin,
                a.y,
                -a.x * sin + a.z * cos
            )
        },
        rotateZ: (a: Point3d, angle: number) => {
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            return new Point3d(
                a.x * cos - a.y * sin,
                a.x * sin + a.y * cos,
                a.z
            )
        },
        rotateXY: (a: Point3d, angle: number) => {
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            return new Point3d(
                a.x * cos - a.y * sin,
                a.x * sin + a.y * cos,
                a.z
            )
        },
        rotateXZ: (a: Point3d, angle: number) => {
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            return new Point3d(
                a.x * cos + a.z * sin,
                a.y,
                -a.x * sin + a.z * cos
            )
        },
        rotateYZ: (a: Point3d, angle: number) => {
            const cos = Math.cos(angle)
            const sin = Math.sin(angle)
            return new Point3d(
                a.x,
                a.y * cos - a.z * sin,
                a.y * sin + a.z * cos
            )
        }
    })
)

const isPlusOrMinus = (val: string): val is "+" | "-" =>
    val === "+" || val === "-"

const tokenize = (
    val: string,
    tokenList: TokenList,
    openCloseParenthesisTokens: Array<[Token, Token]>
) => {
    let typeOld: Type | undefined
    let tokenOld: Token | undefined
    let tokenValue = ""
    let expectNumberOrTextOrParenthesis = false
    let openParentheses = 0
    const openParenthesisStack: Array<Token> = []
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

                if (expectNumberOrTextOrParenthesis) {
                    if (
                        token.type !== "number" &&
                        token.type !== "text" &&
                        token.value !== "("
                    )
                        throw new Error(`Expected number, got ${token.type}`)
                    tokenOld!.type = "sign"
                }
                expectNumberOrTextOrParenthesis =
                    token.type === "operator" &&
                    tokenOld?.type === "operator" &&
                    isPlusOrMinus(token.value)
                if (tokenOld) tokenOld.next = token
                tokenOld = token
                tokenList.first ??= token
            }
            tokenValue = char
        } else tokenValue = char
        typeOld = type
    }
    if (openParentheses !== 0) throw new Error("Unbalanced parentheses")
}

// const traverse = (tokenList: TokenList) => {
//     for (const token of tokenList) {
//         console.log(token.value)
//         if (token.linked) traverse(token.linked)
//     }
// }

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

        const tokenList = new TokenList()
        const openCloseParenthesisTokens: Array<[Token, Token]> = []
        try {
            tokenize(val, tokenList, openCloseParenthesisTokens)
        } catch (err) {
            console.warn(err)
            return
        }
        openCloseParenthesisTokens.reverse()
        for (const [
            openParenthesisToken,
            closeParenthesisToken
        ] of openCloseParenthesisTokens) {
            if (openParenthesisToken.next !== closeParenthesisToken)
                openParenthesisToken.linked = new TokenList(
                    openParenthesisToken.next
                )
            openParenthesisToken.next = closeParenthesisToken.next
            closeParenthesisToken.prev = undefined
            closeParenthesisToken.next = undefined
        }
        // traverse(tokenList)
    }

    public evaluate(scope?: Record<string, number>) {}
}
