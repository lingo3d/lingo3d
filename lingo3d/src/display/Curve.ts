import { Point3d } from "@lincode/math"
import scene from "../engine/scene"
import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial } from "three"
import EventLoopItem from "../api/core/EventLoopItem"
import { debounceInstance } from "@lincode/utils"
import Sphere from "./primitives/Sphere"
import getVecOnCurve from "./utils/getVecOnCurve"
import { point2Vec } from "./utils/vec2Point"
import ICurve, { curveDefaults, curveSchema } from "../interface/ICurve"

const ARC_SEGMENTS = 50

export const addPointWithHelper = (curve: Curve, pt: Point3d) => {
    curve.addPoint(pt)
    const helper = new Sphere()
    helper.scale = 0.1
    helper.placeAt(pt)
    //@ts-ignore
    curve._append(helper)
    helper.name = "point"

    helper.onMove = () => {
        Object.assign(pt, helper.getWorldPosition())
        //@ts-ignore
        curve.update()
    }
    return helper
}

export default class Curve extends EventLoopItem implements ICurve {
    public static componentName = "curve"
    public static defaults = curveDefaults
    public static schema = curveSchema

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
    private update() {
        Curve.update(this, this)
    }

    public addPoint(pt: Point3d) {
        this._points.push(pt)
        this.update()
    }
}
