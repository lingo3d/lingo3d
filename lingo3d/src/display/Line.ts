import { Point3d } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { Reactive } from "@lincode/reactivity"
import { BufferGeometry, LineBasicMaterial, Line as ThreeLine, Color } from "three"
import EventLoopItem from "../api/core/EventLoopItem"
import { addBloom, deleteBloom } from "../engine/renderLoop/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import scene from "../engine/scene"
import { point2Vec } from "./utils/vec2Point"

export default class Line extends EventLoopItem {
    private material = new LineBasicMaterial()

    public constructor() {
        super()

        this.createEffect(() => {
            const { from, to, bloom } = this
            if (!from || !to) return

            const geometry = new BufferGeometry().setFromPoints([point2Vec(from), point2Vec(to)])
            const line = new ThreeLine(geometry, this.material)

            scene.add(line)
            bloom && addBloom(line)

            return () => {
                scene.remove(line)
                deleteBloom(line)
            }
        }, [this.refresh.get])
    }

    private _bloom?: boolean
    public get bloom() {
        return this._bloom
    }
    public set bloom(value) {
        this._bloom = value
        this.refresh.set({})
    }


    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.material.dispose()
        return this
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
        return "#" + this.material.color.getHexString()
    }
    public set color(val) {
        this.material.color = new Color(val)
    }

    public get thickness() {
        return this.material.linewidth
    }
    public set thickness(val) {
        this.material.linewidth = val
    }
}