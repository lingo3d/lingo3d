import Appendable from "../display/core/Appendable"
import { GameObjectType } from "../api/serializer/types"
import GameGraphChild from "./GameGraphChild"
import { createObjectPtr } from "../pointers/createObjectPtr"
import { templateNodeSet } from "../typeGuards/isTemplateNode"

export default class TemplateNode extends GameGraphChild {
    public spawnNode!: string

    public constructor() {
        super()
        this.$disableSelection = true
        templateNodeSet.add(this)
    }

    public set source(type: GameObjectType | Appendable) {
        const target =
            typeof type === "string" ? createObjectPtr[0](type) : type
        target.dispose()
        this.children = target.children
        this._name = target.name
        this._id = target.id
        Object.setPrototypeOf(this, target)
    }
}
