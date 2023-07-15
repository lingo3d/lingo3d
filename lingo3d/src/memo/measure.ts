import { Box3, Object3D, SkinnedMesh, Vector3 } from "three"
import { box3, vector3 } from "../display/utils/reusables"
import computeOnceWithData from "./utils/computeOnceWithData"

const _box = new Box3()

const expandByObject = (object: any) => {
    object.updateMatrixWorld()

    const { geometry } = object
    if (geometry) {
        if (object instanceof SkinnedMesh) {
            const position = geometry.attributes.position
            for (let i = 0, il = position.count; i < il; i++) {
                vector3.fromBufferAttribute(position, i)
                //@ts-ignore
                object.applyBoneTransform(i, vector3)
                object.localToWorld(vector3)
                box3.expandByPoint(vector3)
            }
        } else {
            if (geometry.boundingBox === null) geometry.computeBoundingBox()
            _box.copy(geometry.boundingBox)
            _box.applyMatrix4(object.matrixWorld)
            box3.union(_box)
        }
    }
    const children = object.children
    for (let i = 0, l = children.length; i < l; i++) expandByObject(children[i])
}

export const measure = computeOnceWithData(
    (_: string, data: { target: Object3D }) => {
        const size = new Vector3()
        const center = new Vector3()
        box3.makeEmpty()
        expandByObject(data.target)
        box3.getSize(size)
        box3.getCenter(center)
        return <const>[size, center, 1]
    }
)
