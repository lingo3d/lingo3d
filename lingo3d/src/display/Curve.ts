import { Point3d } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import EventLoopItem from "../api/core/EventLoopItem"
import {
    addBloom,
    deleteBloom
} from "../engine/renderLoop/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import scene from "../engine/scene"
import { point2Vec } from "./utils/vec2Point"
import {
    CatmullRomCurve3,
    Mesh,
    MeshStandardMaterial,
    TubeBufferGeometry
} from "three"

export default class Line extends EventLoopItem {
    private material = new MeshStandardMaterial()

    public constructor() {
        super()

        this.createEffect(() => {
            const { points, bloom } = this
            if (!points) return

            const vecs = points.map(point2Vec)
            const curve = new CatmullRomCurve3(vecs, false, "catmullrom")
            const geometry = new TubeBufferGeometry(curve, 100, 1, 2, true)

            const mesh = new Mesh(geometry, this.material)

            scene.add(mesh)
            bloom && addBloom(mesh)

            return () => {
                scene.remove(mesh)
                geometry.dispose()
                deleteBloom(mesh)
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

    private _points?: Array<Point3d>
    public get points() {
        return this._points
    }
    public set points(value) {
        this._points = value
        this.refresh.set({})
    }
}
