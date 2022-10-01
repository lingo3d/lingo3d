import store, { createEffect } from "@lincode/reactivity"
import { BlendFunction, SelectiveBloomEffect, Selection } from "postprocessing"
import { Object3D } from "three"
import { getBloomIntensity } from "../../../states/useBloomIntensity"
import { getBloomRadius } from "../../../states/useBloomRadius"
import { getBloomThreshold } from "../../../states/useBloomThreshold"
import { getCameraRendered } from "../../../states/useCameraRendered"
import {
    getSelectiveBloom,
    setSelectiveBloom
} from "../../../states/useSelectiveBloom"
import scene from "../../scene"

const selection = new Selection()
export const addSelectiveBloom = (target: Object3D) => {
    selection.add(target)
    selection.size === 1 && setSelectiveBloom(true)
}

export const deleteSelectiveBloom = (target: Object3D) =>
    selection.delete(target)

const [setSelectiveBloomEffect, getSelectiveBloomEffect] = store<
    SelectiveBloomEffect | undefined
>(undefined)
export { getSelectiveBloomEffect }

createEffect(() => {
    if (!getSelectiveBloom()) return

    const effect = new SelectiveBloomEffect(scene, getCameraRendered(), {
        blendFunction: BlendFunction.ADD,
        mipmapBlur: true
    })
    setSelectiveBloomEffect(effect)

    effect.selection = selection

    const handle0 = getBloomIntensity((val) => (effect.intensity = val))
    const handle1 = getBloomThreshold(
        (val) => (effect.luminanceMaterial.threshold = val)
    )
    const handle2 = getBloomRadius(
        //@ts-ignore
        (val) => (effect.mipmapBlurPass.radius = Math.min(val, 0.9))
    )
    return () => {
        setSelectiveBloomEffect(undefined)
        effect.dispose()
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
    }
}, [getSelectiveBloom, getCameraRendered])
