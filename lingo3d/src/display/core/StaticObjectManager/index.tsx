import { distance3d, Point3d } from "@lincode/math"
import {
    Color,
    Material,
    Matrix3,
    MeshStandardMaterial,
    MeshToonMaterial,
    Object3D,
    PropertyBinding
} from "three"
import {
    clickSet,
    mouseDownSet,
    mouseOutSet,
    mouseMoveSet,
    mouseOverSet,
    mouseUpSet
} from "./raycast"
import {
    frustum,
    matrix4,
    ray,
    vector3,
    vector3_1,
    vector3_half
} from "../../utils/reusables"
import { applyMixins, forceGet, throttle } from "@lincode/utils"
import { OBB } from "three/examples/jsm/math/OBB"
import { scaleDown, scaleUp } from "../../../engine/constants"
import {
    addBloom,
    deleteBloom
} from "../../../engine/renderLoop/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import worldToClient from "../../utils/worldToClient"
import { Cancellable } from "@lincode/promiselikes"
import { point2Vec, vec2Point } from "../../utils/vec2Point"
import { LingoMouseEvent } from "../../../interface/IMouse"
import {
    addSSR,
    deleteSSR
} from "../../../engine/renderLoop/effectComposer/ssrPass"
import {
    addOutline,
    deleteOutline
} from "../../../engine/renderLoop/effectComposer/outlinePass"
import getCenter from "../../utils/getCenter"
import EventLoopItem from "../../../api/core/EventLoopItem"
import IStaticObjectManager from "../../../interface/IStaticObjectManaget"
import AnimationMixin from "../mixins/AnimationMixin"
import MeshItem, { getObject3d } from "../MeshItem"
import { Reactive } from "@lincode/reactivity"
import copyStandard from "./applyMaterialProperties/copyStandard"
import copyToon from "./applyMaterialProperties/copyToon"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { onBeforeRender } from "../../../events/onBeforeRender"
import diffQuaternions from "../../utils/diffQuaternions"
import getWorldPosition from "../../utils/getWorldPosition"

const thisOBB = new OBB()
const targetOBB = new OBB()

const updateFrustum = throttle(
    () => {
        const camera = getCameraRendered()
        frustum.setFromProjectionMatrix(
            matrix4.multiplyMatrices(
                camera.projectionMatrix,
                camera.matrixWorldInverse
            )
        )
    },
    200,
    "leading"
)

const forcePBRSet = new WeakSet<Material>()

const setNumber = (
    child: any,
    property: string,
    factor: number | undefined
) => {
    const defaultValue: number | undefined = (child.userData[property] ??=
        child.material[property])
    child.material[property] =
        factor === undefined
            ? defaultValue
            : (defaultValue || (forcePBRSet.has(child.material) ? 1 : 0)) *
              factor
}

const setBoolean = (
    child: any,
    property: string,
    value: boolean | undefined
) => {
    const defaultValue: boolean | undefined = (child.userData[property] ??=
        child.material[property])
    child.material[property] = value === undefined ? defaultValue : value
}

const setColor = (child: any, property: string, value: Color | undefined) => {
    const defaultValue: Color | undefined = (child.userData[property] ??=
        child.material[property])
    child.material[property] = value === undefined ? defaultValue : value
}

export const idMap = new Map<string, Set<StaticObjectManager>>()
const makeSet = () => new Set()

class StaticObjectManager<T extends Object3D = Object3D>
    extends EventLoopItem
    implements IStaticObjectManager
{
    public constructor(public object3d: T) {
        super(object3d)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this._id !== undefined && idMap.get(this._id)!.delete(this)
        return this
    }

    protected _id?: string
    public get id() {
        return this._id
    }
    public set id(val: string | undefined) {
        this._id !== undefined && idMap.get(this._id)!.delete(this)
        this._id = val
        val !== undefined && forceGet(idMap, val, makeSet).add(this)
    }

    protected addToRaycastSet(set: Set<Object3D>) {
        set.add(this.object3d)
        return new Cancellable(() => set.delete(this.object3d))
    }

    private _onClick?: (e: LingoMouseEvent) => void
    public get onClick(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onClick
    }
    public set onClick(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this._onClick = cb
        this.cancelHandle(
            "onClick",
            cb && (() => this.addToRaycastSet(clickSet))
        )
    }

    private _onMouseDown?: (e: LingoMouseEvent) => void
    public get onMouseDown(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseDown
    }
    public set onMouseDown(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this._onMouseDown = cb
        this.cancelHandle(
            "onMouseDown",
            cb && (() => this.addToRaycastSet(mouseDownSet))
        )
    }

    private _onMouseUp?: (e: LingoMouseEvent) => void
    public get onMouseUp(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseUp
    }
    public set onMouseUp(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this._onMouseUp = cb
        this.cancelHandle(
            "onMouseUp",
            cb && (() => this.addToRaycastSet(mouseUpSet))
        )
    }

    private _onMouseOver?: (e: LingoMouseEvent) => void
    public get onMouseOver(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseOver
    }
    public set onMouseOver(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this._onMouseOver = cb
        this.cancelHandle(
            "onMouseOver",
            cb && (() => this.addToRaycastSet(mouseOverSet))
        )
    }

    private _onMouseOut?: (e: LingoMouseEvent) => void
    public get onMouseOut(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseOut
    }
    public set onMouseOut(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this._onMouseOut = cb
        this.cancelHandle(
            "onMouseOut",
            cb && (() => this.addToRaycastSet(mouseOutSet))
        )
    }

    private _onMouseMove?: (e: LingoMouseEvent) => void
    public get onMouseMove(): ((e: LingoMouseEvent) => void) | undefined {
        return this._onMouseMove
    }
    public set onMouseMove(cb: ((e: LingoMouseEvent) => void) | undefined) {
        this._onMouseMove = cb
        this.cancelHandle(
            "onMouseMove",
            cb && (() => this.addToRaycastSet(mouseMoveSet))
        )
    }

    public get name() {
        return this.outerObject3d.name
    }
    public set name(val: string) {
        this.outerObject3d.name = PropertyBinding.sanitizeNodeName(val)
    }

    protected getRay() {
        return ray.set(
            getWorldPosition(this.object3d),
            this.object3d.getWorldDirection(vector3)
        )
    }

    public pointAt(distance: number) {
        return vec2Point(this.getRay().at(distance * scaleDown, vector3))
    }

    public rayIntersectsAt(target: StaticObjectManager, maxDistance?: number) {
        if (this.done) return undefined
        if (target.done) return undefined
        if (this === target) return undefined

        targetOBB.set(
            getWorldPosition(target.object3d),
            vector3_half,
            new Matrix3().setFromMatrix4(target.object3d.matrixWorld)
        )

        const vec = targetOBB.intersectRay(this.getRay(), vector3)
        if (!vec) return

        if (maxDistance) {
            const { x, y, z } = getWorldPosition(this.object3d)
            if (
                distance3d(vec.x, vec.y, vec.z, x, y, z) * scaleUp >
                maxDistance
            )
                return
        }
        return vec2Point(vec)
    }

    public rayIntersects(target: StaticObjectManager) {
        return !!this.rayIntersectsAt(target)
    }

    public intersects(target: StaticObjectManager) {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        thisOBB.set(
            getWorldPosition(this.object3d),
            vector3_1.clone(),
            new Matrix3()
        )
        thisOBB.applyMatrix4(this.object3d.matrixWorld)

        targetOBB.set(
            getWorldPosition(target.object3d),
            vector3_1.clone(),
            new Matrix3()
        )
        targetOBB.applyMatrix4(target.object3d.matrixWorld)

        return thisOBB.intersectsOBB(targetOBB, 0)
    }

    public get clientX() {
        return worldToClient(this.object3d).x
    }

    public get clientY() {
        return worldToClient(this.object3d).y
    }

    public get reflection() {
        return !!this.object3d.userData.ssr
    }
    public set reflection(val: boolean) {
        val && addSSR(this.object3d)
        this.cancelHandle(
            "reflection",
            val && (() => new Cancellable(() => deleteSSR(this.object3d)))
        )
    }

    public get bloom() {
        return !!this.outerObject3d.userData.bloom
    }
    public set bloom(val: boolean) {
        val && addBloom(this.outerObject3d)
        this.cancelHandle(
            "bloom",
            val &&
                (() => new Cancellable(() => deleteBloom(this.outerObject3d)))
        )
    }

    public get outline() {
        return !!this.object3d.userData.outline
    }
    public set outline(val: boolean) {
        val && addOutline(this.object3d)
        this.cancelHandle(
            "outline",
            val && (() => new Cancellable(() => deleteOutline(this.object3d)))
        )
    }

    private _visible?: boolean
    public get visible() {
        return this._visible !== false
    }
    public set visible(val: boolean) {
        this._visible = val
        this.outerObject3d.visible = val
    }

    public get frustumCulled() {
        return this.outerObject3d.frustumCulled
    }
    public set frustumCulled(val: boolean) {
        this.outerObject3d.traverse((child) => (child.frustumCulled = val))
    }

    private _refreshFactors?: Reactive<{}>
    protected refreshFactors() {
        if (this._refreshFactors) {
            this._refreshFactors.set({})
            return
        }
        this._refreshFactors = new Reactive({})

        this.createEffect(() => {
            const handle = new Cancellable()

            const {
                _toon,
                _pbr,
                _metalnessFactor,
                _roughnessFactor,
                _opacityFactor,
                _emissiveIntensityFactor,
                _emissiveColorFactor,
                _colorFactor
            } = this

            this.outerObject3d.traverse((child: any) => {
                let { material } = child
                if (!material) return

                Array.isArray(material) && (material = material[0])

                if (_toon) {
                    child.material = new MeshToonMaterial()
                    copyToon(material, child.material)
                } else if (_pbr) {
                    forcePBRSet.add(
                        (child.material = new MeshStandardMaterial())
                    )
                    copyStandard(material, child.material)
                }

                if (_metalnessFactor !== undefined)
                    setNumber(
                        child,
                        "metalness",
                        _metalnessFactor !== 0 ? _metalnessFactor : undefined
                    )

                if (_roughnessFactor !== undefined)
                    setNumber(
                        child,
                        "roughness",
                        _roughnessFactor !== 1 ? _roughnessFactor : undefined
                    )

                if (_opacityFactor !== undefined) {
                    setNumber(child, "opacity", _opacityFactor)
                    setBoolean(
                        child,
                        "transparent",
                        _opacityFactor !== 1 ? true : undefined
                    )
                }

                if (_emissiveIntensityFactor !== undefined)
                    setNumber(
                        child,
                        "emissiveIntensity",
                        _emissiveIntensityFactor !== 1
                            ? _emissiveIntensityFactor
                            : undefined
                    )

                if (_emissiveColorFactor !== undefined)
                    setColor(
                        child,
                        "emissive",
                        _emissiveColorFactor !== "#000000"
                            ? new Color(_emissiveColorFactor)
                            : undefined
                    )

                if (_colorFactor !== undefined)
                    setColor(
                        child,
                        "color",
                        _colorFactor !== "#ffffff"
                            ? new Color(_colorFactor)
                            : undefined
                    )

                handle.then(() => {
                    child.material.dispose()
                    child.material = material
                })
            })
            return () => {
                handle.cancel()
            }
        }, [this._refreshFactors.get])
    }

    private _metalnessFactor?: number
    public get metalnessFactor() {
        return this._metalnessFactor
    }
    public set metalnessFactor(val) {
        this._metalnessFactor = val
        this.refreshFactors()
    }

    private _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor
    }
    public set roughnessFactor(val) {
        this._roughnessFactor = val
        this.refreshFactors()
    }

    private _opacityFactor?: number
    public get opacityFactor() {
        return this._opacityFactor
    }
    public set opacityFactor(val) {
        this._opacityFactor = val
        this.refreshFactors()
    }

    private _emissiveIntensityFactor?: number
    public get emissiveIntensityFactor() {
        return this._emissiveIntensityFactor
    }
    public set emissiveIntensityFactor(val) {
        this._emissiveIntensityFactor = val
        this.refreshFactors()
    }

    private _emissiveColorFactor?: string
    public get emissiveColorFactor() {
        return this._emissiveColorFactor
    }
    public set emissiveColorFactor(val) {
        this._emissiveColorFactor = val
        this.refreshFactors()
    }

    private _colorFactor?: string
    public get colorFactor() {
        return this._colorFactor
    }
    public set colorFactor(val) {
        this._colorFactor = val
        this.refreshFactors()
    }

    private _toon?: boolean
    public get toon() {
        return this._toon ?? false
    }
    public set toon(val) {
        this._toon = val
        this.refreshFactors()
    }

    private _pbr?: boolean
    public get pbr() {
        return this._pbr ?? false
    }
    public set pbr(val) {
        this._pbr = val
        this.refreshFactors()
    }

    public get frustumVisible() {
        updateFrustum()
        return frustum.containsPoint(getCenter(this.object3d))
    }

    public lookAt(target: MeshItem | Point3d): void
    public lookAt(x: number, y: number | undefined, z: number): void
    public lookAt(a0: MeshItem | Point3d | number, a1?: number, a2?: number) {
        if (typeof a0 === "number") {
            this.lookAt(
                new Point3d(
                    a0,
                    a1 === undefined
                        ? this.outerObject3d.position.y * scaleUp
                        : a1,
                    a2!
                )
            )
            return
        }
        if ("outerObject3d" in a0)
            this.outerObject3d.lookAt(getWorldPosition(getObject3d(a0)))
        else this.outerObject3d.lookAt(point2Vec(a0))
    }

    public onLookToEnd: (() => void) | undefined

    public lookTo(target: MeshItem | Point3d, alpha: number): void
    public lookTo(
        x: number,
        y: number | undefined,
        z: number,
        alpha: number
    ): void
    public lookTo(
        a0: MeshItem | Point3d | number,
        a1: number | undefined,
        a2?: number,
        a3?: number
    ) {
        if (typeof a0 === "number") {
            this.lookTo(
                new Point3d(
                    a0,
                    a1 === undefined
                        ? this.outerObject3d.position.y * scaleUp
                        : a1,
                    a2!
                ),
                a3!
            )
            return
        }
        const { quaternion } = this.outerObject3d
        const quaternionOld = quaternion.clone()
        this.lookAt(a0)
        const quaternionNew = quaternion.clone()

        quaternion.copy(quaternionOld)

        this.cancelHandle("lookTo", () =>
            onBeforeRender(() => {
                quaternion.slerp(quaternionNew, a1!)

                const { x, y, z } = diffQuaternions(quaternion, quaternionNew)
                if (Math.abs(x) + Math.abs(y) + Math.abs(z) < 0.001) {
                    this.cancelHandle("lookTo", undefined)
                    this.onLookToEnd?.()

                    quaternion.copy(quaternionNew)
                }
            })
        )
    }
}
interface StaticObjectManager<T extends Object3D = Object3D>
    extends EventLoopItem,
        AnimationMixin {}
applyMixins(StaticObjectManager, [AnimationMixin])
export default StaticObjectManager
