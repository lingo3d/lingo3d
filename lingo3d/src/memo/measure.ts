import { Bone, Box3, Object3D, SkinnedMesh, Vector3 } from "three"
import { box3, vector3 } from "../display/utils/reusables"
import computeOnceWithData from "./utils/computeOnceWithData"
import { noMeshSet } from "../collections/noMeshSet"

const _box = new Box3()

const expandByObject = (object: Object3D) => {
    //@ts-ignore
    const { geometry, children } = object
    if (geometry) {
        if (object instanceof SkinnedMesh) {
            const { position } = geometry.attributes
            for (let i = 0, il = position.count; i < il; i++) {
                vector3.fromBufferAttribute(position, i)
                object.applyBoneTransform(i, vector3)
                object.localToWorld(vector3)
                box3.expandByPoint(vector3)
            }
        } else {
            !geometry.boundingBox && geometry.computeBoundingBox()
            _box.copy(geometry.boundingBox)
            _box.applyMatrix4(object.matrixWorld)
            box3.union(_box)
        }
    }
    for (let i = 0, l = children.length; i < l; i++) expandByObject(children[i])
}

const expandBySkeleton = (object: Object3D) => {
    const { children } = object
    if (object instanceof Bone) {
        object.getWorldPosition(vector3)
        box3.expandByPoint(vector3)
    }
    for (let i = 0, l = children.length; i < l; i++)
        expandBySkeleton(children[i])
}

export const measure = computeOnceWithData(
    (_: string, data: { target: Object3D }) => {
        const size = new Vector3()
        const center = new Vector3()
        box3.makeEmpty()
        data.target.updateMatrixWorld()
        noMeshSet.has(data.target)
            ? expandBySkeleton(data.target)
            : expandByObject(data.target)

        if (box3.isEmpty()) return <const>[size.set(1, 1, 1), center, 1]

        box3.getSize(size)
        box3.getCenter(center)
        return <const>[size, center, 1]
    }
)
