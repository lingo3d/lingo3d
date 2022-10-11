import store, { createEffect } from "@lincode/reactivity"
import { OutlineEffect, Selection } from "postprocessing"
import { Object3D } from "three"
import loadTexture from "../../../display/utils/loaders/loadTexture"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getOutline, setOutline } from "../../../states/useOutline"
import { getOutlineColor } from "../../../states/useOutlineColor"
import { getOutlineHiddenColor } from "../../../states/useOutlineHiddenColor"
import { getOutlinePattern } from "../../../states/useOutlinePattern"
import { getOutlinePulse } from "../../../states/useOutlinePulse"
import { getOutlineStrength } from "../../../states/useOutlineStrength"
import scene from "../../scene"

const [setOutlineEffect, getOutlineEffect] = store<OutlineEffect | undefined>(
    undefined
)
export { getOutlineEffect }

const selection = new Selection()
export const addOutline = (target: Object3D) => {
    selection.add(target)
    selection.size === 1 && setOutline(true)
}

export const deleteOutline = (target: Object3D) => selection.delete(target)

createEffect(() => {
    if (!getOutline()) return

    const effect = new OutlineEffect(scene, getCameraRendered())
    setOutlineEffect(effect)

    effect.selection = selection

    const handle0 = getOutlineColor((val) => effect.visibleEdgeColor.set(val))
    const handle1 = getOutlineHiddenColor((val) =>
        effect.hiddenEdgeColor.set(val)
    )
    const handle2 = getOutlinePattern(
        //@ts-ignore
        (val) => (effect.patternTexture = val ? loadTexture(val) : null)
    )
    const handle3 = getOutlinePulse((val) => (effect.pulseSpeed = val))
    const handle4 = getOutlineStrength((val) => (effect.edgeStrength = val))

    return () => {
        setOutlineEffect(undefined)
        effect.dispose()
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
        handle3.cancel()
        handle4.cancel()
    }
}, [getOutline, getCameraRendered])
