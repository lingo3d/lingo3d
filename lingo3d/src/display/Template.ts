import Appendable from "./core/Appendable"
import createObjectWithoutTemplate, {
    GameObjectTypeWithoutTemplate
} from "../api/serializer/createObjectWithoutTemplate"
import { templateSet } from "../typeGuards/isTemplate"

export default class Template extends Appendable {
    public constructor() {
        super()
        this.$disableSelection = true
        templateSet.add(this)
    }

    public set source(type: GameObjectTypeWithoutTemplate | Appendable) {
        const target =
            typeof type === "string" ? createObjectWithoutTemplate(type) : type
        target.dispose(false, true)
        this.children = target.children
        this._name = target.name
        this._id = target.id
        Object.setPrototypeOf(this, target)
    }
}
