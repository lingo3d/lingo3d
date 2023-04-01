import Template from "../display/Template"
import TemplateNode from "../visualScripting/TemplateNode"

export const templateSet = new WeakSet<Template>()
export const isTemplate = (val: any): val is Template => templateSet.has(val)

export const templateNodeSet = new WeakSet<TemplateNode>()
export const isTemplateNode = (val: any): val is TemplateNode =>
    templateNodeSet.has(val)
