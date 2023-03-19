import Appendable from "../api/core/Appendable"
import createObject from "../api/serializer/createObject"
import { GameObjectType } from "../api/serializer/types"

export const templateSet = new WeakSet<Template>()
export const isTemplate = (val: any): val is Template => templateSet.has(val)

export default class Template extends Appendable {
    public constructor() {
        super()
        templateSet.add(this)
    }

    public set source(type: GameObjectType | Appendable) {
        const target = typeof type === "string" ? createObject(type) : type
        target.dispose()
        this.children = target.children
        this._name = target.name
        this._id = target.id
        Object.setPrototypeOf(this, target)
    }
}
