import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial } from "three"
import getVecOnCurve from "./utils/getVecOnCurve"
import { point2Vec } from "./utils/vec2Point"
import ICurve, { curveDefaults, curveSchema } from "../interface/ICurve"
import { createMemo, createNestedEffect, Reactive } from "@lincode/reactivity"
import { Cancellable } from "@lincode/promiselikes"
import HelperSphere from "./core/utils/HelperSphere"
import MeshAppendable from "./core/MeshAppendable"
import { getEditorHelper } from "../states/useEditorHelper"
import { Point3dType } from "../utils/isPoint"
import { TransformControlsPayload } from "../events/onTransformControls"

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

export default class Curve extends MeshAppendable implements ICurve {
    public static componentName = "curve"
    public static defaults = curveDefaults
    public static schema = curveSchema

    public constructor() {
        super()
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

        this.createEffect(() => {
            const helpers = createFor(
                this.helperState.get() && getEditorHelper() ? this._points : [],
                (pt, cleanup) => {
                    const helper = new HelperSphere(undefined)
                    this.append(helper)
                    helper.scale = 0.2
                    const handle = helper.$events.on(
                        "transformEdit",
                        ({ phase, mode }: TransformControlsPayload) => {
                            if (mode !== "translate" || phase !== "end") return
                            Object.assign(pt, helper.getWorldPosition())
                            this.refreshState.set({})
                        }
                    )
                    cleanup.then(() => {
                        helper.dispose()
                        handle.cancel()
                    })
                    return helper
                }
            )
            for (const [point, helper] of helpers) Object.assign(helper, point)
        }, [this.helperState.get, this.refreshState.get, getEditorHelper])
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

    private _points: Array<Point3dType> = []
    public get points() {
        return this._points
    }
    public set points(val) {
        this._points = val
        this.refreshState.set({})
    }

    public addPoint(pt: Point3dType) {
        this._points.push(pt)
        this.refreshState.set({})
    }
}
