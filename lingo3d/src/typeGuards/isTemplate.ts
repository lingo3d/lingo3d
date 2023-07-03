import Template from "../display/Template"

export const templateSet = new WeakSet<Template>()
export const isTemplate = (val: any): val is Template =>
    val && templateSet.has(val)
