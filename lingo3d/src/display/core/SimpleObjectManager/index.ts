import { rad2Deg, deg2Rad, distance3d, Point3d } from "@lincode/math"
import { Object3D, Vector3 } from "three"
import { vector3 } from "../../utils/reusables"
import { scaleDown, scaleUp } from "../../../engine/constants"
import { point2Vec } from "../../utils/vec2Point"
import ISimpleObjectManager, { OnIntersectValue } from "../../../interface/ISimpleObjectManager"
import getCenter from "../../utils/getCenter"
import PositionedItem from "../../../api/core/PositionedItem"
import StaticObjectManager, { idMap } from "../StaticObjectManager"
import { applyMixins } from "@lincode/utils"
import PhysicsMixin from "../mixins/PhysicsMixin"
import bvhContactMap from "../mixins/PhysicsMixin/bvh/bvhContactMap"
import { cannonContactBodies, cannonContactMap } from "../mixins/PhysicsMixin/cannon/cannonLoop"
import { Reactive } from "@lincode/reactivity"
import { Cancellable } from "@lincode/promiselikes"
import MeshItem, { getObject3d } from "../MeshItem"
import { onBeforeRender } from "../../../events/onBeforeRender"
import getWorldPosition from "../../utils/getWorldPosition"
import getWorldQuaternion from "../../utils/getWorldQuaternion"

const ptDistCache = new WeakMap<Point3d, number>()
const distance3dCached = (pt: Point3d, vecSelf: Vector3) => {
    const cached = ptDistCache.get(pt)
    if (cached) return cached

    const result = distance3d(pt.x, pt.y, pt.z, vecSelf.x * scaleUp, vecSelf.y * scaleUp, vecSelf.z * scaleUp)
    ptDistCache.set(pt, result)
    return result
}

class SimpleObjectManager<T extends Object3D = Object3D> extends StaticObjectManager<T> implements ISimpleObjectManager {
    public declare object3d: T

    public getRayIntersectionsAt(id: string, maxDistance?: number) {
        const result: Array<[StaticObjectManager, Point3d]> = []
        for (const target of idMap.get(id) ?? []) {
            if (target === this) continue
            const pt = this.rayIntersectsAt(target, maxDistance)
            pt && result.push([target, pt])
        }
        const vec = getWorldPosition(this.object3d)
        return result.sort((a, b) => {
            return distance3dCached(a[1], vec) - distance3dCached(b[1], vec)
        })
    }

    public getRayIntersections(id: string, maxDistance?: number) {
        return this.getRayIntersectionsAt(id, maxDistance).map(result => result[0])
    }

    public listenToRayIntersection(id: string, cb: (target: StaticObjectManager, pt: Point3d) => void, maxDistance?: number) {
        return this.beforeRender(() => {
            for (const [target, pt] of this.getRayIntersectionsAt(id, maxDistance))
                cb(target, pt)
        })
    }

    public getIntersections(id: string) {
        const result: Array<StaticObjectManager> = []
        for (const target of idMap.get(id) ?? []) {
            if (target === this) continue
            this.intersects(target) && result.push(target)
        }
        return result
    }

    public listenToIntersection(id: string, cb?: OnIntersectValue, cbOut?: OnIntersectValue) {
        let intersectionsOld: Array<StaticObjectManager> = []

        return this.beforeRender(() => {
            const intersections = this.getIntersections(id)

            if (cb)
                for (const target of intersections)
                    if (!intersectionsOld.includes(target))
                        cb(target)

            if (cbOut)
                for (const target of intersectionsOld)
                    if (!intersections.includes(target))
                        cbOut(target)
                    
            intersectionsOld = intersections
        })
    }

    private onIntersectState?: Reactive<OnIntersectValue | undefined>
    private onIntersectOutState?: Reactive<OnIntersectValue | undefined>
    private intersectIdsState?: Reactive<Array<string> | undefined>

    private initIntersect() {
        if (this.onIntersectState) return

        this.onIntersectState = new Reactive<OnIntersectValue | undefined>(undefined)
        this.onIntersectOutState = new Reactive<OnIntersectValue | undefined>(undefined)
        this.intersectIdsState = new Reactive<Array<string> | undefined>(undefined)

        this.createEffect(() => {
            const { onIntersect, onIntersectOut, intersectIds } = this
            if (!intersectIds || (!onIntersect && !onIntersectOut)) return

            const handles: Array<Cancellable> = []

            for (const id of intersectIds)
                handles.push(this.listenToIntersection(id, onIntersect, onIntersectOut))

            return () => {
                for (const handle of handles)
                    handle.cancel()
            }
        }, [this.onIntersectState.get, this.onIntersectOutState.get, this.intersectIdsState.get])
    }
    
    public get onIntersect() {
        return this.onIntersectState?.get()
    }
    public set onIntersect(val: OnIntersectValue | undefined) {
        this.initIntersect()
        this.onIntersectState?.set(val)
    }

    public get onIntersectOut() {
        return this.onIntersectOutState?.get()
    }
    public set onIntersectOut(val: OnIntersectValue | undefined) {
        this.initIntersect()
        this.onIntersectOutState?.set(val)
    }

    public get intersectIds() {
        return this.intersectIdsState?.get()
    }
    public set intersectIds(val: Array<string> | undefined) {
        this.initIntersect()
        this.intersectIdsState?.set(val)
    }

    public override intersects(target: StaticObjectManager): boolean {
        if (this.done) return false
        if (target.done) return false
        if (this === target) return false

        if (target instanceof SimpleObjectManager) {
            if ((this.bvhMap && target.bvhCharacter) || (this.bvhCharacter && target.bvhMap))
                return (
                    bvhContactMap.get(this)?.has(target) ||
                    bvhContactMap.get(target)?.has(this) || false
                )

            if (this.cannonBody && target.cannonBody) {
                cannonContactBodies.add(this.cannonBody)
                cannonContactBodies.add(target.cannonBody)
                return (
                    cannonContactMap.get(this.cannonBody)?.has(target.cannonBody) ||
                    cannonContactMap.get(target.cannonBody)?.has(this.cannonBody) || false
                )
            }
        }
        return super.intersects(target)
    }

    public get width() {
        return this.object3d.scale.x * scaleUp
    }
    public set width(val: number) {
        this.object3d.scale.x = val * scaleDown
    }

    public get height() {
        return this.object3d.scale.y * scaleUp
    }
    public set height(val: number) {
        this.object3d.scale.y = val * scaleDown
    }

    public get depth() {
        return this.object3d.scale.z * scaleUp
    }
    public set depth(val: number) {
        this.object3d.scale.z = val * scaleDown
    }

    public get x() {
        return this.outerObject3d.position.x * scaleUp
    }
    public set x(val: number) {
        this.outerObject3d.position.x = val * scaleDown
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).x = true)
    }

    public get y() {
        return this.outerObject3d.position.y * scaleUp
    }
    public set y(val: number) {
        this.outerObject3d.position.y = val * scaleDown
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).y = true)
    }

    public get z() {
        return this.outerObject3d.position.z * scaleUp
    }
    public set z(val: number) {
        this.outerObject3d.position.z = val * scaleDown
        this.physicsUpdate && ((this.physicsUpdate.position ??= {}).z = true)
    }

    public get scaleX() {
        return this.outerObject3d.scale.x
    }
    public set scaleX(val: number) {
        this.outerObject3d.scale.x = val
    }

    public get scaleY() {
        return this.outerObject3d.scale.y
    }
    public set scaleY(val: number) {
        this.outerObject3d.scale.y = val
    }

    public get scaleZ() {
        return this.outerObject3d.scale.z
    }
    public set scaleZ(val: number) {
        this.outerObject3d.scale.z = val
    }

    public get scale() {
        return this.scaleX
    }
    public set scale(val: number) {
        this.scaleX = val
        this.scaleY = val
        this.scaleZ = val
    }

    public get rotationX() {
        return this.outerObject3d.rotation.x * rad2Deg
    }
    public set rotationX(val: number) {
        this.outerObject3d.rotation.x = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).x = true)
    }

    public get rotationY() {
        return this.outerObject3d.rotation.y * rad2Deg
    }
    public set rotationY(val: number) {
        this.outerObject3d.rotation.y = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).y = true)
    }

    public get rotationZ() {
        return this.outerObject3d.rotation.z * rad2Deg
    }
    public set rotationZ(val: number) {
        this.outerObject3d.rotation.z = val * deg2Rad
        this.physicsUpdate && ((this.physicsUpdate.rotation ??= {}).z = true)
    }

    public get rotation() {
        return this.rotationZ
    }
    public set rotation(val: number) {
        this.rotationZ = val
    }

    public get innerVisible() {
        return this.object3d.visible
    }
    public set innerVisible(val: boolean) {
        this.object3d.visible = val
    }

    public override lookAt(target: MeshItem | Point3d): void
    public override lookAt(x: number, y: number | undefined, z: number): void
    public override lookAt(a0: any, a1?: any, a2?: any) {
        super.lookAt(a0, a1, a2)
        this.physicsRotate()
    }

    public translateX(val: number) {
        this.outerObject3d.translateX(val * scaleDown)
        this.physicsMove()
    }

    public translateY(val: number) {
        this.outerObject3d.translateY(val * scaleDown)
        this.physicsMove()
    }

    public translateZ(val: number) {
        this.outerObject3d.translateZ(val * scaleDown)
        this.physicsMove()
    }

    public placeAt(object: MeshItem | Point3d) {
        if ("outerObject3d" in object) {
            this.outerObject3d.position.copy(getCenter(getObject3d(object)))
            this.outerObject3d.quaternion.copy(getWorldQuaternion(object.outerObject3d))
        }
        else this.outerObject3d.position.copy(point2Vec(object))

        this.physicsMove()
        this.physicsRotate()
    }

    public moveForward(distance: number) {
        if (distance === 0) return

		vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
		vector3.crossVectors(this.outerObject3d.up, vector3)
		this.outerObject3d.position.addScaledVector(vector3, distance * scaleDown)

        this.physicsMoveXZ()
	}

    public moveRight(distance: number) {
        if (distance === 0) return

		vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
		this.outerObject3d.position.addScaledVector(vector3, distance * scaleDown)

        this.physicsMoveXZ()
	}

    public onMoveToEnd: (() => void) | undefined

    public lerpTo(x: number, y: number, z: number, alpha: number) {
        const from = new Vector3(this.x, this.y, this.z)
        const to = new Vector3(x, y, z)

        this.cancelHandle("lerpTo", () => onBeforeRender(() => {
            const { x, y, z } = from.lerp(to, alpha)

            if (Math.abs(this.x - x) < 0.1 && Math.abs(this.y - y) < 0.1 && Math.abs(this.z - z) < 0.1) {
                this.cancelHandle("lerpTo", undefined)
                this.onMoveToEnd?.()
            }
            this.x = x
            this.y = y
            this.z = z

            this.physicsMove()
        }))
    }

    public moveTo(x: number, y: number | undefined, z: number, speed: number) {
        const { x: rx, y: ry, z: rz } = new Vector3(x - this.x, y === undefined ? 0 : y - this.y, z - this.z).normalize()
        const sx = speed * rx
        const sy = speed * ry
        const sz = speed * rz

        let distOld = Infinity
        this.cancelHandle("lerpTo", () => onBeforeRender(() => {
            this.x += sx
            y !== undefined && (this.y += sy)
            this.z += sz
            
            let dist = distance3d(this.x, y === undefined ? 0 : this.y, this.z, x, y === undefined ? 0 : y, z)
            if (dist >= distOld) {
                this.cancelHandle("lerpTo", undefined)
                this.onMoveToEnd?.()

                this.x = x
                y !== undefined && (this.y = y)
                this.z = z
            }
            distOld = dist

            y === undefined ? this.physicsMoveXZ() : this.physicsMove()
        }))
    }
}
interface SimpleObjectManager<T extends Object3D = Object3D> extends StaticObjectManager, PositionedItem, PhysicsMixin {}
applyMixins(SimpleObjectManager, [PositionedItem, PhysicsMixin])
export default SimpleObjectManager