import { Point3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { LineBasicMaterial } from "three"
import EventLoopItem from "../api/core/EventLoopItem"

export default class Line extends EventLoopItem {
    private material = new LineBasicMaterial()

    public constructor() {
        super()
    }

    private refresh = new Reactive({})

    private _from?: Point3d
    public get from() {
        return this._from
    }
    public set from(value) {
        this._from = value
        this.refresh.set({})
    }

    private _to?: Point3d
    public get to() {
        return this._to
    }
    public set to(value) {
        this._to = value
        this.refresh.set({})
    }

    public get color() {
        return this.material.color
    }
    public set color(value) {
        this.material.color = value
    }
}