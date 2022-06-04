import { createEffect } from "@lincode/reactivity"
import { BoxHelper } from "three"
import { skinnedMeshSet } from "../display/utils/cloneSkinnedMesh"
import { getCamera } from "../states/useCamera"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { loop } from "./eventLoop"
import mainCamera from "./mainCamera"
import scene from "./scene"

export default {}

createEffect(() => {
    const target = getSelectionTarget()
    if (!target || getCamera() !== mainCamera) return

    //@ts-ignore
    console.log(skinnedMeshSet.has(target.loadedResolvable._value))

    return () => {
    }
}, [getSelectionTarget, getCamera])