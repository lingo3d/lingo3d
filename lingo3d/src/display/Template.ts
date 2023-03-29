import Appendable from "../api/core/Appendable"
import createObjectWithoutTemplate, {
    GameObjectTypeWithoutTemplate
} from "../api/serializer/createObjectWithoutTemplate"
import { unselectableSet } from "./core/utils/raycast/selectionCandidates"

export const templateSet = new WeakSet<Template>()
export const isTemplate = (val: any): val is Template => templateSet.has(val)

export default class Template extends Appendable {
    public constructor() {
        super()
        templateSet.add(this)
        unselectableSet.add(this)
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
