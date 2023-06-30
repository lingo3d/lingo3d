import { defaultsOwnKeysRecordMap } from "../../collections/defaultsCollections"
import IMathNode, {
    mathNodeDefaults,
    mathNodeSchema
} from "../../interface/IMathNode"
import GameGraphChild from "../GameGraphChild"
import { extractParenthesisTree, compile } from "./compile"
import math from "../../math"
import { Token, TokenList, tokenize } from "./tokenize"
import {
    runtimeIncludeKeysMap,
    runtimeSchemaMap
} from "../../collections/runtimeCollections"

export default class MathNode extends GameGraphChild implements IMathNode {
    public static componentName = "mathNode"
    public static defaults = mathNodeDefaults
    public static schema = mathNodeSchema
    public static includeKeys = ["expression"]

    protected mathFn = math

    private setRuntimeData(
        runtimeDefaults?: Record<string, any>,
        runtimeSchema?: Record<string, any>,
        runtimeIncludeKeys?: Set<string>
    ) {
        this.runtimeDefaults = runtimeDefaults
        runtimeSchema
            ? runtimeSchemaMap.set(this, runtimeSchema)
            : runtimeSchemaMap.delete(this)
        runtimeIncludeKeys
            ? runtimeIncludeKeysMap.set(this, runtimeIncludeKeys)
            : runtimeIncludeKeysMap.delete(this)

        if (!runtimeSchema) {
            this.runtimeData = undefined
            this.$emitEvent("runtimeSchema")
            return
        }
        const runtimeData = (this.runtimeData ??= { out: 0 })
        const runtimeValues = { ...runtimeData }
        const ownKeysRecord: Record<string, true> = {}
        for (const key of Object.keys(runtimeSchema)) {
            Object.defineProperty(runtimeData, key, {
                get: () => {
                    return runtimeValues[key] ?? 0
                },
                set: (value) => {
                    runtimeValues[key] = value
                    runtimeData.out = new Function(this.compiled!)()
                },
                enumerable: true
            })
            ownKeysRecord[key] = true
        }
        ownKeysRecord.out = true
        defaultsOwnKeysRecordMap.set(mathNodeDefaults, ownKeysRecord)
        runtimeData.out = new Function(this.compiled!)()
        runtimeSchema.out = Number
        runtimeDefaults!.out = 0
        runtimeIncludeKeys!.add("out")
        this.$emitEvent("runtimeSchema")
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
            new Set(varTokens.map((token) => token.value))
        )
    }
}
