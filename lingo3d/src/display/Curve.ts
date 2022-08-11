import { Point3d } from "@lincode/math"
import scene from "../engine/scene"
import { point2Vec } from "./utils/vec2Point"
import {
    BufferAttribute,
    BufferGeometry,
    CatmullRomCurve3,
    Line,
    LineBasicMaterial
} from "three"
import { vector3 } from "./utils/reusables"
import EventLoopItem from "../api/core/EventLoopItem"

const ARC_SEGMENTS = 50

export default class Curve extends EventLoopItem {
    private bufferAttribute = new BufferAttribute(
        new Float32Array(ARC_SEGMENTS * 3),
        3
    )

    private curve = new CatmullRomCurve3([], undefined, "catmullrom", 0.5)

    public constructor() {
        super()

        const geometry = new BufferGeometry()
        geometry.setAttribute("position", this.bufferAttribute)

        const material = new LineBasicMaterial({
            color: 0xff0000,
            opacity: 0.35
        })
        const curveMesh = new Line(geometry, material)
        scene.add(curveMesh)

        this.then(() => {
            geometry.dispose()
            material.dispose()
            scene.remove(curveMesh)
        })
    }

    public update() {
        this.bufferAttribute.needsUpdate = true
        if (this.curve.points.length < 2) {
            for (let i = 0; i < ARC_SEGMENTS; ++i)
                this.bufferAttribute.setXYZ(i, 0, 0, 0)
            return
        }
        for (let i = 0; i < ARC_SEGMENTS; ++i) {
            const t = i / (ARC_SEGMENTS - 1)
            this.curve.getPoint(t, vector3)
            this.bufferAttribute.setXYZ(i, vector3.x, vector3.y, vector3.z)
        }
    }

    private _points?: Array<Point3d>
    public get points() {
        return this._points
    }
    public set points(val) {
        this._points = val
        if (!val) return

        this.curve.points = val.map(point2Vec)
        this.update()
    }
}
