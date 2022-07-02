import store, { createEffect } from "@lincode/reactivity"
import { pull } from "@lincode/utils"
import { Color, Object3D, Vector2 } from "three"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import loadTexture from "../../../display/utils/loaders/loadTexture"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { getOutline } from "../../../states/useOutline"
import { getOutlineColor } from "../../../states/useOutlineColor"
import { getOutlineHiddenColor } from "../../../states/useOutlineHiddenColor"
import { getOutlinePattern } from "../../../states/useOutlinePattern"
import { getOutlinePulse } from "../../../states/useOutlinePulse"
import { getOutlineStrength } from "../../../states/useOutlineStrength"
import { getOutlineThickness } from "../../../states/useOutlineThickness"
import scene from "../../scene"

export const outlinePtr = [false]

const outlineSelects: Array<Object3D> = []

export const addOutline = (target: Object3D) => {
    if (target.userData.outline) return
    target.userData.outline = true
    outlineSelects.push(target)
    outlinePtr[0] = true
}

export const deleteOutline = (target: Object3D) => {
    if (!target.userData.outline) return
    target.userData.outline = false
    pull(outlineSelects, target)
}

const [setOutlinePass, getOutlinePass] = store<OutlinePass | undefined>(undefined)
export { getOutlinePass }

createEffect(() => {
    if (!getOutline()) return

    const outlinePass = new OutlinePass(new Vector2(), scene, getCameraRendered(), outlineSelects)
    setOutlinePass(outlinePass)

    const handle0 = getOutlinePulse(pulse => outlinePass.pulsePeriod = pulse * 0.001)
    const handle1 = getOutlineStrength(strength => outlinePass.edgeStrength = strength)
    const handle2 = getOutlineThickness(thickness => outlinePass.edgeThickness = thickness)

    return () => {
        outlinePass.dispose()
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
    }
}, [getCameraRendered, getOutline])

createEffect(() => {
    const outlinePass = getOutlinePass()
    if (!outlinePass) return

    const color = getOutlineColor()
    const hiddenColor = getOutlineHiddenColor() ?? color
    outlinePass.visibleEdgeColor = new Color(color)
    outlinePass.hiddenEdgeColor = new Color(hiddenColor)

}, [getOutlinePass, getOutlineColor, getOutlineHiddenColor])

createEffect(() => {
    const url = getOutlinePattern()
    const outlinePass = getOutlinePass()
    if (!url || !outlinePass) return

    outlinePass.patternTexture = loadTexture(url)
    outlinePass.usePatternTexture = true

    return () => {
        outlinePass.usePatternTexture = false
    }
}, [getOutlinePass, getOutlinePattern])