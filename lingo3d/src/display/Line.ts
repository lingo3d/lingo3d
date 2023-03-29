import { Point3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { Line2 } from "three/examples/jsm/lines/Line2"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import scene from "../engine/scene"
import {
    addSelectiveBloom,
    deleteSelectiveBloom
} from "../engine/renderLoop/effectComposer/selectiveBloomEffect"
import Appendable from "../api/core/Appendable"
import { CM2M } from "../globals"
import { addRefreshStateSystem } from "../systems/autoClear/refreshStateSystem"

export default class Line extends Appendable {
    public constructor() {
        super()

        this.createEffect(() => {
            const { from, to, bloom } = this
            if (!from || !to) return

            const geometry = new LineGeometry().setPositions([
                from.x * CM2M,
                from.y * CM2M,
                from.z * CM2M,
                to.x * CM2M,
                to.y * CM2M,
                to.z * CM2M
            ])
            const material = new LineMaterial({
                linewidth: this._thickness * CM2M
            })
            const line = new Line2(geometry, material)
            scene.add(line)

            bloom && addSelectiveBloom(line)

            return () => {
                scene.remove(line)
                geometry.dispose()
                material.dispose()
                bloom && deleteSelectiveBloom(line)
            }
        }, [this.refreshState.get])
    }

    private refreshState = new Reactive({})

    private _bloom?: boolean
    public get bloom() {
        return this._bloom
    }
    public set bloom(value) {
        this._bloom = value
        addRefreshStateSystem(this.refreshState)
    }

    private _from?: Point3d
    public get from() {
        return this._from
    }
    public set from(value) {
        this._from = value
        addRefreshStateSystem(this.refreshState)
    }

    private _to?: Point3d
    public get to() {
        return this._to
    }
    public set to(value) {
        this._to = value
        addRefreshStateSystem(this.refreshState)
    }

    private _thickness = 1
    public get thickness() {
        return this._thickness
    }
    public set thickness(value) {
        this._thickness = value
        addRefreshStateSystem(this.refreshState)
    }
}
