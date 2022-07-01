import { Point3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { Line2 } from "three/examples/jsm/lines/Line2"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import EventLoopItem from "../api/core/EventLoopItem"
import { scaleDown, scaleUp } from "../engine/constants"
import { addBloom, deleteBloom } from "../engine/renderLoop/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import scene from "../engine/scene"

export default class Line extends EventLoopItem {
    private material = new LineMaterial({ linewidth: 0.001 })

    public constructor() {
        super()

        this.createEffect(() => {
            const { from, to, bloom } = this
            if (!from || !to) return

            const geometry = new LineGeometry().setPositions([
                from.x * scaleDown, from.y * scaleDown, from.z * scaleDown,
                to.x * scaleDown, to.y * scaleDown, to.z * scaleDown
            ])
            const line: any = new Line2(geometry, this.material)

            scene.add(line)
            bloom && addBloom(line)

            return () => {
                scene.remove(line)
                deleteBloom(line)
            }
        }, [this.refresh.get])
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.material.dispose()
        return this
    }

    private refresh = new Reactive({})

    private _bloom?: boolean
    public get bloom() {
        return this._bloom
    }
    public set bloom(value) {
        this._bloom = value
        this.refresh.set({})
    }

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

    public get thickness() {
        return this.material.linewidth * scaleUp
    }
    public set thickness(val) {
        this.material.linewidth = val * scaleDown
    }
}