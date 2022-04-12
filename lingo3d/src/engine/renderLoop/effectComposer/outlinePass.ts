import { createEffect } from "@lincode/reactivity"
import { Color, Vector2 } from "three"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import loadTexture from "../../../display/utils/loaders/loadTexture"
import { getCamera } from "../../../states/useCamera"
import { getOutlineColor } from "../../../states/useOutlineColor"
import { getOutlined } from "../../../states/useOutlined"
import { getOutlineHiddenColor } from "../../../states/useOutlineHiddenColor"
import { getOutlinePattern } from "../../../states/useOutlinePattern"
import { getOutlinePulse } from "../../../states/useOutlinePulse"
import { getOutlineStrength } from "../../../states/useOutlineStrength"
import { getOutlineThickness } from "../../../states/useOutlineThickness"
import scene from "../../scene"

const outlinePass = new OutlinePass(new Vector2(), scene, getCamera())
export default outlinePass

getCamera(camera => outlinePass.renderCamera = camera)
getOutlined(outlined => outlinePass.selectedObjects = outlined)

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

getOutlinePulse(pulse => outlinePass.pulsePeriod = pulse)
getOutlineStrength(strength => outlinePass.edgeStrength = strength)
getOutlineThickness(thickness => outlinePass.edgeThickness = thickness)