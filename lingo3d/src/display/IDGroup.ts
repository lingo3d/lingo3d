import Appendable from "../api/core/Appendable"

export default class Group extends Appendable {
    public static componentName = "idGroup"

    public override get id() {
        return super._id
    }
    public override set id(value) {
        this._id = value
    }
}
