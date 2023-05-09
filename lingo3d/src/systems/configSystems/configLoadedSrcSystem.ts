import { Object3D } from "three"
import { setManager } from "../../api/utils/getManager"
import Loaded from "../../display/core/Loaded"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import { nativeIdMap } from "../../collections/idCollections"

export const [addConfigLoadedSrcSystem, deleteConfigLoadedSrcSystem] =
    configSystemWithCleanUp((self: Loaded<any>) => {
        const { src } = self
        if (!src) return

        let done = false
        const children: Array<Object3D> = []
        self.$load(src).then((loaded) => {
            if (done) return
            const loadedObject3d = self.$resolveLoaded(loaded, src)
            self.$loadedGroup.add((self.$loadedObject3d = loadedObject3d))
            self.events.setState("loaded", loadedObject3d)
            loadedObject3d.traverse((child) => {
                setManager(child, self)
                nativeIdMap.set(child.id, self)
                children.push(child)
            })
        })
        return () => {
            done = true
            self.$loadedGroup.clear()
            self.$loadedObject3d = undefined
            for (const child of children) nativeIdMap.delete(child.id)
        }
    })
