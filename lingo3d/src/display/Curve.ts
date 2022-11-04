import { Point3d } from "@lincode/math"
import scene from "../engine/scene"
import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial } from "three"
import EventLoopItem from "../api/core/EventLoopItem"
import { debounceInstance } from "@lincode/utils"
import Sphere from "./primitives/Sphere"
import getVecOnCurve from "./utils/getVecOnCurve"
import { point2Vec } from "./utils/vec2Point"

const ARC_SEGMENTS = 50

export default class Curve extends EventLoopItem {
    private bufferAttribute = new BufferAttribute(
        new Float32Array(ARC_SEGMENTS * 3),
        3
    )

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

    private _points: Array<Point3d> = []
    public get points() {
        return this._points
    }
    public set points(val) {
        this._points = val
        this.update()
    }

    private static update = debounceInstance((target: Curve) => {
        const { bufferAttribute } = target
        bufferAttribute.needsUpdate = true

        if (target._points.length < 2) {
            for (let i = 0; i < ARC_SEGMENTS; ++i)
                bufferAttribute.setXYZ(i, 0, 0, 0)
            return
        }
        const vecs = target._points.map(point2Vec)
        for (let i = 0; i < ARC_SEGMENTS; ++i) {
            const t = i / (ARC_SEGMENTS - 1)
            const vec = getVecOnCurve(vecs, t)
            bufferAttribute.setXYZ(i, vec.x, vec.y, vec.z)
        }
    })
    public update() {
        Curve.update(this, this)
    }

    public addPoint(pt: Point3d) {
        this._points.push(pt)
        this.update()
    }

    public addPointWithHelper(pt: Point3d) {
        this.addPoint(pt)
        const helper = new Sphere()
        helper.scale = 0.1
        helper.placeAt(pt)
        this._append(helper)
        helper.name = "point"

        helper.onMove = () => {
            Object.assign(pt, helper.getWorldPosition())
            this.update()
        }
        return helper
    }
}
