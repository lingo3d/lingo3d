import { throttle } from "@lincode/utils"
import ObjectManager from "../core/ObjectManager"
import { box3, vector3 } from "./reusables"

const resizeSet = new Set<ObjectManager>()

const resize = throttle(() => {
    for (const manager of resizeSet) {
        const { parent } = manager.outerObject3d
        parent?.remove(manager.outerObject3d)

        box3.setFromObject(manager.outerObject3d)
        manager.object3d.scale.copy(box3.getSize(vector3))
        
        parent?.add(manager.outerObject3d)
    }
    resizeSet.clear()
    
}, 0, "trailing")

export default (obj: ObjectManager) => {
    resizeSet.add(obj)
    resize()
}