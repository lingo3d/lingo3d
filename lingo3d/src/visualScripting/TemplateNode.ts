import Appendable from "../api/core/Appendable"
import createObject from "../api/serializer/createObject"
import { GameObjectType } from "../api/serializer/types"
import GameGraphChild from "./GameGraphChild"
import { templateNodeSet } from "../collections/typeGuards"

export default class TemplateNode extends GameGraphChild {
    public spawnNode!: string

    public constructor() {
        super()
        this.$disableSelection = true
        templateNodeSet.add(this)
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
