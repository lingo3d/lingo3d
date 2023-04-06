import Appendable from "../api/core/Appendable"
import createObjectWithoutTemplate, {
    GameObjectTypeWithoutTemplate
} from "../api/serializer/createObjectWithoutTemplate"
import { selectionDisabledSet } from "../collections/selectionDisabledSet"
import { templateSet } from "../collections/typeGuards"

export default class Template extends Appendable {
    public constructor() {
        super()
        templateSet.add(this)
        selectionDisabledSet.add(this)
    }

    public set source(type: GameObjectTypeWithoutTemplate | Appendable) {
        const target =
            typeof type === "string" ? createObjectWithoutTemplate(type) : type
        target.dispose()
        this.children = target.children
        this._name = target.name
        this._id = target.id
        Object.setPrototypeOf(this, target)
    }
}
