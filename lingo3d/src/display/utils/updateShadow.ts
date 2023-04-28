import { LightShadow } from "three"
import { onAfterRender } from "../../events/onAfterRender"

let resX = 0
let resY = 0
onAfterRender(() => {
    console.log(resX, resY)
    resX = resY = 0
})

export default (shadow: LightShadow) => {
    if (shadow.needsUpdate || !shadow.map) return
    shadow.needsUpdate = true
    resX += shadow.map.width
    resY += shadow.map.height
}
