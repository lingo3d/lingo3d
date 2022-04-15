import { createEffect } from "@lincode/reactivity"
import { pull } from "@lincode/utils"
import { Color, Object3D, Vector2 } from "three"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import loadTexture from "../../../display/utils/loaders/loadTexture"
import { getCamera } from "../../../states/useCamera"
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

const outlinePass = new OutlinePass(new Vector2(), scene, getCamera(), outlineSelects)
export default outlinePass

getCamera(camera => outlinePass.renderCamera = camera)

createEffect(() => {
    const color = getOutlineColor()
    const hiddenColor = getOutlineHiddenColor() ?? color
    outlinePass.visibleEdgeColor = new Color(color)
    outlinePass.hiddenEdgeColor = new Color(hiddenColor)

}, [getOutlineColor, getOutlineHiddenColor])

createEffect(() => {
    const url = getOutlinePattern()
    if (!url) return

    outlinePass.patternTexture = loadTexture(url)
    outlinePass.usePatternTexture = true

    return () => {
        outlinePass.usePatternTexture = false
    }
}, [getOutlinePattern])

getOutlinePulse(pulse => outlinePass.pulsePeriod = pulse * 0.001)
getOutlineStrength(strength => outlinePass.edgeStrength = strength)
getOutlineThickness(thickness => outlinePass.edgeThickness = thickness)