import { Point3d } from "@lincode/math"
import scene from "../engine/scene"
import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial } from "three"
import getVecOnCurve from "./utils/getVecOnCurve"
import { point2Vec } from "./utils/vec2Point"
import ICurve, { curveDefaults, curveSchema } from "../interface/ICurve"
import { createMemo, createNestedEffect, Reactive } from "@lincode/reactivity"
import { Cancellable } from "@lincode/promiselikes"
import { overrideSelectionCandidates } from "./core/StaticObjectManager/raycast/selectionCandidates"
import HelperSphere from "./core/utils/HelperSphere"
import { getCameraRendered } from "../states/useCameraRendered"
import mainCamera from "../engine/mainCamera"
import Appendable from "../api/core/Appendable"

const createFor = <Result, Data>(
    dataList: Array<Data>,
    create: (data: Data, cleanup: Cancellable) => Result
) => {
    const dataNewSet = new Set(dataList)
    const dataOldSet = createMemo(() => new Set<Data>(), [])
    const dataResultMap = createMemo(() => new Map<Data, Result>(), [])
    const dataCleanupMap = createMemo(() => new Map<Data, Cancellable>(), [])

    for (const data of dataNewSet)
        if (!dataOldSet.has(data)) {
            const handle = new Cancellable()
            dataResultMap.set(data, create(data, handle))
            dataCleanupMap.set(data, handle)
        }
    for (const data of dataOldSet)
        if (!dataNewSet.has(data)) {
            dataCleanupMap.get(data)!.cancel()
            dataCleanupMap.delete(data)
            dataResultMap.delete(data)
        }
    createNestedEffect(() => {
        return () => {
            for (const handle of dataCleanupMap.values()) handle.cancel()
        }
    }, [])

    dataOldSet.clear()
    for (const data of dataList) dataOldSet.add(data)

    return dataResultMap
}

export default class Curve extends Appendable implements ICurve {
    public static componentName = "curve"
    public static defaults = curveDefaults
    public static schema = curveSchema

    public constructor() {
        super()
        scene.add(this.outerObject3d)

        this.createEffect(() => {
            const segments = this._points.length * this._subdivide

            const bufferAttribute = new BufferAttribute(
                new Float32Array(segments * 3),
                3
            )
            const geometry = new BufferGeometry()
            geometry.setAttribute("position", bufferAttribute)
            const material = new LineBasicMaterial({ color: 0xff0000 })
            const curveMesh = new Line(geometry, material)
            curveMesh.frustumCulled = false
            curveMesh.userData.unselectable = true
            this.outerObject3d.add(curveMesh)

            if (this._points.length < 2)
                for (let i = 0; i < segments; ++i)
                    bufferAttribute.setXYZ(i, 0, 0, 0)
            else {
                const vecs = this._points.map(point2Vec)
                for (let i = 0; i < segments; ++i) {
                    const t = i / (segments - 1)
                    const vec = getVecOnCurve(vecs, t)
                    bufferAttribute.setXYZ(i, vec.x, vec.y, vec.z)
                }
            }
            return () => {
                geometry.dispose()
                material.dispose()
                this.outerObject3d.remove(curveMesh)
            }
        }, [this.refreshState.get])

        let move = false
        this.createEffect(() => {
            const helpers = createFor(
                this.helperState.get() && getCameraRendered() === mainCamera
                    ? this._points
                    : [],
                (pt, cleanup) => {
                    const helper = new HelperSphere()
                    this.append(helper)
                    helper.scale = 0.1
                    overrideSelectionCandidates.add(helper.outerObject3d)
                    helper.onMove = () => {
                        move = true
                        Object.assign(pt, helper.getWorldPosition())
                        this.refreshState.set({})
                    }
                    cleanup.then(() => {
                        helper.dispose()
                        overrideSelectionCandidates.delete(helper.outerObject3d)
                    })
                    return helper
                }
            )
            if (move) {
                move = false
                return
            }
            for (const [point, helper] of helpers) Object.assign(helper, point)
        }, [this.helperState.get, this.refreshState.get, getCameraRendered])
    }

    private refreshState = new Reactive({})

    private helperState = new Reactive(false)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }

    private _subdivide = 3
    public get subdivide() {
        return this._subdivide
    }
    public set subdivide(val) {
        this._subdivide = val
        this.refreshState.set({})
    }

    private _points: Array<Point3d> = []
    public get points() {
        return this._points
    }
    public set points(val) {
        this._points = val
        this.refreshState.set({})
    }

    public addPoint(pt: Point3d) {
        this._points.push(pt)
        this.refreshState.set({})
    }
}
