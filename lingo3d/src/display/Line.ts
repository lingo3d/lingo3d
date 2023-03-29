import { Point3d } from "@lincode/math"
import Appendable from "../api/core/Appendable"
import {
    addConfigLineSystem,
    deleteConfigLineSystem
} from "../systems/autoClear/configLineSystem"

export default class Line extends Appendable {
    protected override disposeNode() {
        super.disposeNode()
        deleteConfigLineSystem(this)
    }

    private _bloom?: boolean
    public get bloom() {
        return this._bloom
    }
    public set bloom(value) {
        this._bloom = value
        addConfigLineSystem(this)
    }

    private _from?: Point3d
    public get from() {
        return this._from
    }
    public set from(value) {
        this._from = value
        addConfigLineSystem(this)
    }

    private _to?: Point3d
    public get to() {
        return this._to
    }
    public set to(value) {
        this._to = value
        addConfigLineSystem(this)
    }

    private _thickness = 1
    public get thickness() {
        return this._thickness
    }
    public set thickness(value) {
        this._thickness = value
        addConfigLineSystem(this)
    }
}
