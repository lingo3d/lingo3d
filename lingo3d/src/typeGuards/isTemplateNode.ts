import TemplateNode from "../visualScripting/TemplateNode"

export const templateNodeSet = new WeakSet<TemplateNode>()
export const isTemplateNode = (val: any): val is TemplateNode =>
    val && templateNodeSet.has(val)
