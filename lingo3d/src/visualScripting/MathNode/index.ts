import Appendable from "../../api/core/Appendable"
import IMathNode, {
    mathNodeDefaults,
    mathNodeSchema
} from "../../interface/IMathNode"
import { extractParenthesisTree, compile } from "./compile"
import functions from "./functions"
import { Token, TokenList, tokenize } from "./tokenize"

export default class MathNode extends Appendable implements IMathNode {
    public static componentName = "mathNode"
    public static defaults = mathNodeDefaults
    public static schema = mathNodeSchema
    public static includeKeys = ["expression"]

    protected functions = functions

    private setRuntimeData(
        runtimeDefaults?: Record<string, any>,
        runtimeSchema?: Record<string, any>,
        runtimeIncludeKeys?: Array<string>
    ) {
        this.runtimeDefaults = runtimeDefaults
        this.runtimeSchema = runtimeSchema
        this.runtimeIncludeKeys = runtimeIncludeKeys
        if (runtimeSchema) {
            const runtimeData = (this.runtimeData = { output: 0 })
            const runtimeValues: Record<string, any> = {}
            for (const key of Object.keys(runtimeSchema))
                Object.defineProperty(runtimeData, key, {
                    get: () => {
                        return runtimeValues[key] ?? 0
                    },
                    set: (value) => {
                        runtimeValues[key] = value
                        runtimeData.output = eval(this.compiled!)
                    }
                })
            runtimeData.output = eval(this.compiled!)
            runtimeSchema.output = Number
            runtimeDefaults!.output = 0
            runtimeIncludeKeys!.push("output")
        } else this.runtimeData = undefined
        this._propertyChangedEvent?.emit("runtimeSchema")
    }

    private compiled?: string
    private _expression?: string
    public get expression() {
        return this._expression
    }
    public set expression(val) {
        this._expression = val
        if (!val) {
            this.setRuntimeData()
            return
        }
        const tokenList = new TokenList()
        try {
            extractParenthesisTree(tokenize(val, tokenList))
        } catch (err) {
            this.setRuntimeData()
            console.warn(err)
            return
        }
        const varTokens: Array<Token> = []
        this.compiled = compile(tokenList, varTokens)
        this.setRuntimeData(
            Object.fromEntries(varTokens.map((token) => [token.value, 0])),
            Object.fromEntries(varTokens.map((token) => [token.value, Number])),
            varTokens.map((token) => token.value)
        )
    }

    public evaluate(scope?: Record<string, number>) {}
}
