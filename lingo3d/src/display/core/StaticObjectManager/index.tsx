import { Object3D } from "three"
import { forceGetInstance } from "@lincode/utils"
import IStaticObjectManager from "../../../interface/IStaticObjectManager"
import "./raycast"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { uuidMap } from "../../../api/core/collections"
import { CM2M } from "../../../globals"
import getWorldDirection from "../../utils/getWorldDirection"
import getWorldPosition from "../../utils/getWorldPosition"
import { ray, vector3 } from "../../utils/reusables"
import { vec2Point } from "../../utils/vec2Point"

const userIdMap = new Map<string, Set<StaticObjectManager>>()

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

export default class StaticObjectManager<T extends Object3D = Object3D>
    extends MeshAppendable<T>
    implements IStaticObjectManager
{
    protected override _dispose() {
        super._dispose()
        this._id && userIdMap.get(this._id)!.delete(this)
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
