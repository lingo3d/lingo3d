import { Object3D } from "three"
import { onBeforeRender } from "../../events/onBeforeRender"
import getWorldPosition from "./getWorldPosition"
import getWorldQuaternion from "./getWorldQuaternion"

export const trackPositionSet = new Set<Object3D>()
export const trackQuaternionSet = new Set<Object3D>()

onBeforeRender(() => {
    for (const object of trackPositionSet) {
        const { userData } = object
        const position = getWorldPosition(object)
        userData.positionChanged = userData.positionOld
            ? !position.equals(userData.positionOld)
            : true
        userData.positionOld = position
    }
    for (const object of trackQuaternionSet) {
        const { userData } = object
        const quaternion = getWorldQuaternion(object)
        userData.quaternionChanged = userData.quaternionOld
            ? !quaternion.equals(userData.quaternionOld)
            : true
        userData.quaternionOld = quaternion
    }
})
