import { Cancellable } from "@lincode/promiselikes"
import { WebGLCubeRenderTarget, HalfFloatType, CubeCamera } from "three"
import type Model from "../../display/Model"
import { NEAR } from "../../globals"
import unsafeSetValue from "../../utils/unsafeSetValue"
import {
    reflectionChangedSet,
    reflectionDataMap
} from "../../collections/reflectionCollections"
import { uuidTextureMap } from "../../collections/idCollections"
import FoundManager from "../../display/core/FoundManager"
import configLoadedSystem from "../utils/configLoadedSystem"
import { reflectionSystem } from "../reflectionSystem"

const setFactor = (
    factor: number | undefined,
    textureManager: FoundManager,
    key: string
) =>
    unsafeSetValue(
        textureManager,
        key,
        factor === undefined || factor === 1
            ? textureManager.$defaults[key]
            : Math.max(textureManager.$defaults[key], 0.25) * factor
    )

export const [addRefreshFactorsSystem] = configLoadedSystem((model: Model) => {
    const {
        metalnessFactor,
        roughnessFactor,
        opacityFactor,
        envFactor,
        reflection
    } = model

    if (reflectionChangedSet.has(model)) {
        reflectionChangedSet.delete(model)

        reflectionDataMap.get(model)?.[1].cancel()
        reflectionDataMap.delete(model)

        if (reflection) {
            const reflectionHandle = new Cancellable()
            const cubeRenderTarget = new WebGLCubeRenderTarget(128)
            const { texture: reflectionTexture } = cubeRenderTarget
            reflectionTexture.type = HalfFloatType
            reflectionDataMap.set(model, [reflectionTexture, reflectionHandle])
            const cubeCamera = new CubeCamera(NEAR, 10, cubeRenderTarget)

            reflectionSystem.add(model, { cubeCamera, cubeRenderTarget })
            uuidTextureMap.set(reflectionTexture.uuid, reflectionTexture)

            reflectionHandle.then(() => {
                cubeRenderTarget.dispose()
                reflectionSystem.delete(model)
                uuidTextureMap.delete(reflectionTexture.uuid)
            })
        }
    }
    const reflectionTexture = reflectionDataMap.get(model)?.[0]
    for (const textureManager of model.findAllMeshes()) {
        setFactor(metalnessFactor, textureManager, "metalness")
        setFactor(roughnessFactor, textureManager, "roughness")
        setFactor(opacityFactor, textureManager, "opacity")
        setFactor(envFactor, textureManager, "envMapIntensity")
        textureManager.envMap = reflectionTexture?.uuid
    }
})
