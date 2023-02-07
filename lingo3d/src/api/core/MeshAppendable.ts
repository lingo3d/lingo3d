import { forceGetInstance } from "@lincode/utils"
import { Object3D, PropertyBinding, Quaternion, Vector3 } from "three"
import getWorldDirection from "../../display/utils/getWorldDirection"
import getWorldPosition from "../../display/utils/getWorldPosition"
import { ray, vector3 } from "../../display/utils/reusables"
import { vec2Point } from "../../display/utils/vec2Point"
import { emitName } from "../../events/onName"
import { CM2M } from "../../globals"
import IMeshAppendable from "../../interface/IMeshAppendable"
import { setManager } from "../utils/getManager"
import Appendable from "./Appendable"
import { uuidMap } from "./collections"

const userIdMap = new Map<string, Set<MeshAppendable>>()

export const getMeshAppendablesById = (
    id: string
): Array<MeshAppendable> | Set<MeshAppendable> => {
    const uuidInstance = uuidMap.get(id)
    if (uuidInstance && "object3d" in uuidInstance) return [uuidInstance]
    return userIdMap.get(id) ?? []
}

const isStringArray = (array: Array<unknown>): array is Array<string> =>
    typeof array[0] === "string"

export const getMeshAppendables = (
    val: string | Array<string> | MeshAppendable | Array<MeshAppendable>
): Array<MeshAppendable> | Set<MeshAppendable> => {
    if (typeof val === "string") return getMeshAppendablesById(val)
    if (Array.isArray(val)) {
        const result: Array<MeshAppendable> = []
        if (isStringArray(val))
            for (const id of val)
                for (const meshAppendable of getMeshAppendablesById(id))
                    result.push(meshAppendable)
        else for (const meshAppendable of val) result.push(meshAppendable)
        return result
    }
    return [val]
}

export default class MeshAppendable<T extends Object3D = Object3D>
    extends Appendable
    implements IMeshAppendable
{
    public object3d: T
    public position: Vector3
    public quaternion: Quaternion
    public userData: Record<string, any>

    public constructor(public outerObject3d: T = new Object3D() as T) {
        super()
        setManager(outerObject3d, this)
        this.object3d = outerObject3d
        this.position = outerObject3d.position
        this.quaternion = outerObject3d.quaternion
        this.userData = outerObject3d.userData
    }

    public declare parent?: MeshAppendable
    public declare children?: Set<Appendable | MeshAppendable>

    public declare traverse: (
        cb: (appendable: Appendable | MeshAppendable) => void
    ) => void

    public declare traverseSome: (
        cb: (appendable: Appendable | MeshAppendable) => unknown
    ) => boolean

    public override append(child: Appendable | MeshAppendable) {
        this._append(child)
        "outerObject3d" in child && this.outerObject3d.add(child.outerObject3d)
    }

    public attach(child: Appendable | MeshAppendable) {
        this._append(child)
        "outerObject3d" in child &&
            this.outerObject3d.attach(child.outerObject3d)
    }

    protected override _dispose() {
        super._dispose()
        this._id && userIdMap.get(this._id)!.delete(this)
        this.outerObject3d.parent?.remove(this.outerObject3d)
    }

    public get name() {
        return this.outerObject3d.name
    }
    public set name(val) {
        this.outerObject3d.name = PropertyBinding.sanitizeNodeName(val)
        emitName(this)
    }

    protected _id?: string
    public get id() {
        return this._id
    }
    public set id(val) {
        this._id && userIdMap.get(this._id)!.delete(this)
        this._id = val
        val && forceGetInstance(userIdMap, val, Set).add(this)
    }

    protected getRay() {
        return ray.set(
            getWorldPosition(this.object3d),
            getWorldDirection(this.object3d)
        )
    }

    public pointAt(distance: number) {
        return vec2Point(this.getRay().at(distance * CM2M, vector3))
    }
}
