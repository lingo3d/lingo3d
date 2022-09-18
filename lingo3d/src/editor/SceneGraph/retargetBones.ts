import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { Bone as ThreeBone } from "three"
import { getRetargetBones } from "../../states/useRetargetBones"

createEffect(() => {
    const dummy = getRetargetBones()
    if (!dummy) return

    const handle = new Cancellable()

    handle.watch(
        dummy.loaded.then((loadedGroup) => {
            const bone = loadedGroup.getObjectByProperty(
                "type",
                "Bone"
            ) as ThreeBone
            bone.traverse((parent) => (parent.name = "mixamorig" + parent.name))
        })
    )
    return () => {
        handle.cancel()
    }
}, [getRetargetBones])
