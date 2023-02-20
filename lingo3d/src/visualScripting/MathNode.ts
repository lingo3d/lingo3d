import Appendable from "../api/core/Appendable"

const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numbers = "0123456789"

export default class MathNode extends Appendable {
    private _expression?: string
    public get expression() {
        return this._expression
    }
    public set expression(val) {
        this._expression = val
    }

    public evaluate(scope?: Record<string, number>) {}
}
