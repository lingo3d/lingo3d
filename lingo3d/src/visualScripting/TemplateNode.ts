import Appendable from "../api/core/Appendable"
import createObject from "../api/serializer/createObject"
import { GameObjectType } from "../api/serializer/types"

const templateNodeSet = new WeakSet<TemplateNode>()
export const isTemplateNode = (val: any): val is TemplateNode =>
    templateNodeSet.has(val)

export default class TemplateNode extends Appendable {
    public constructor(target?: Appendable) {
        super()
        templateNodeSet.add(this)
        if (!target) return
        target.dispose()
        Object.setPrototypeOf(this, target)
    }

    public set source(type: GameObjectType) {
        const target = createObject(type)
        target.dispose()
        Object.setPrototypeOf(this, target)
    }
}
