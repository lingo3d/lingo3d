import store, { createEffect } from "@lincode/reactivity"
import { BlendFunction, SelectiveBloomEffect } from "postprocessing"
import { Object3D } from "three"
import { getBloomIntensity } from "../../../states/useBloomIntensity"
import { getBloomRadius } from "../../../states/useBloomRadius"
import { getBloomThreshold } from "../../../states/useBloomThreshold"
import { getCameraRendered } from "../../../states/useCameraRendered"
import {
    getSelectiveBloom,
    setSelectiveBloom
} from "../../../states/useSelectiveBloom"
import unsafeGetValue from "../../../utils/unsafeGetValue"
import scene from "../../scene"

let objectSet = new Set<Object3D>()
export const addSelectiveBloom = (target: Object3D) => {
    objectSet.add(target)
    objectSet.size === 1 && setSelectiveBloom(true)
}

export const deleteSelectiveBloom = (target: Object3D) =>
    objectSet.delete(target)

const [setSelectiveBloomEffect, getSelectiveBloomEffect] = store<
    SelectiveBloomEffect | undefined
>(undefined)
export { getSelectiveBloomEffect }

createEffect(() => {
    if (!getSelectiveBloom()) return

    const effect = new SelectiveBloomEffect(scene, getCameraRendered(), {
        blendFunction: BlendFunction.ADD,
        mipmapBlur: true,
        luminanceSmoothing: 0.3
    })
    setSelectiveBloomEffect(effect)

    for (const object of objectSet) effect.selection.add(object)
    objectSet = effect.selection

    const handle0 = getBloomIntensity((val) => (effect.intensity = val))
    const handle1 = getBloomThreshold(
        (val) => (effect.luminanceMaterial.threshold = val)
    )
    const handle2 = getBloomRadius(
        (val) =>
            (unsafeGetValue(effect, "mipmapBlurPass").radius = Math.min(
                val,
                0.9
            ))
    )
    return () => {
        setSelectiveBloomEffect(undefined)
        effect.dispose()
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
    }
}, [getSelectiveBloom, getCameraRendered])
