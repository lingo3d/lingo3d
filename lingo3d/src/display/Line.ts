import Appendable from "./core/Appendable"
import { Point3dType } from "../utils/isPoint"
import { configLineSystem } from "../systems/configSystems/configLineSystem"

export default class Line extends Appendable {
    private _bloom?: boolean
    public get bloom() {
        return this._bloom
    }
    public set bloom(value) {
        this._bloom = value
        configLineSystem.add(this)
    }

    private _from?: Point3dType
    public get from() {
        return this._from
    }
    public set from(value) {
        this._from = value
        configLineSystem.add(this)
    }

    private _to?: Point3dType
    public get to() {
        return this._to
    }
    public set to(value) {
        this._to = value
        configLineSystem.add(this)
    }

    private _thickness = 1
    public get thickness() {
        return this._thickness
    }
    public set thickness(value) {
        this._thickness = value
        configLineSystem.add(this)
    }
}
