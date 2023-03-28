import { Cancellable } from "@lincode/promiselikes"
import { forceGet } from "@lincode/utils"
import {
    WebGLCubeRenderTarget,
    HalfFloatType,
    CubeCamera,
    Object3D,
    Texture
} from "three"
import { StandardMesh } from "../display/core/mixins/TexturedStandardMixin"
import { uuidTextureMap } from "../display/core/mixins/utils/createMap"
import TextureManager from "../display/core/TextureManager"
import type Model from "../display/Model"
import { NEAR } from "../globals"
import renderSystemAutoClear from "../utils/renderSystemAutoClear"
import unsafeSetValue from "../utils/unsafeSetValue"
import { addReflectionSystem, deleteReflectionSystem } from "./reflectionSystem"

const modelTextureManagersMap = new WeakMap<Model, Array<TextureManager>>()

const setFactor = (
    factor: number | undefined,
    textureManager: TextureManager,
    key: string
) =>
    unsafeSetValue(
        textureManager,
        key,
        factor === undefined
            ? textureManager.defaults[key]
            : Math.max(textureManager.defaults[key], 0.25) * factor
    )

export const reflectionChangedSet = new WeakSet<Model>()
export const reflectionDataMap = new WeakMap<Model, [Texture, Cancellable]>()

export const [addRefreshFactorsSystem] = renderSystemAutoClear(
    (model: Model) => {
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
                const cubeRenderTarget = new WebGLCubeRenderTarget(
                    reflection ? 128 : 16
                )
                const { texture: reflectionTexture } = cubeRenderTarget
                reflectionTexture.type = HalfFloatType
                reflectionDataMap.set(model, [
                    reflectionTexture,
                    reflectionHandle
                ])
                const cubeCamera = new CubeCamera(NEAR, 10, cubeRenderTarget)

                addReflectionSystem(model, { cubeCamera, cubeRenderTarget })
                uuidTextureMap.set(reflectionTexture.uuid, reflectionTexture)

                reflectionHandle.then(() => {
                    cubeRenderTarget.dispose()
                    deleteReflectionSystem(model)
                    uuidTextureMap.delete(reflectionTexture.uuid)
                })
            }
        }
        const textureManagers = forceGet(modelTextureManagersMap, model, () => {
            const result: Array<TextureManager> = []
            model.outerObject3d.traverse((child: Object3D | StandardMesh) => {
                if (!("material" in child)) return
                const { TextureManager } = child.material.userData
                TextureManager && result.push(new TextureManager(child, model))
            })
            return result
        })
        const reflectionTexture = reflectionDataMap.get(model)?.[0]
        for (const textureManager of textureManagers) {
            setFactor(metalnessFactor, textureManager, "metalness")
            setFactor(roughnessFactor, textureManager, "roughness")
            setFactor(opacityFactor, textureManager, "opacity")
            setFactor(envFactor, textureManager, "envMapIntensity")
            textureManager.envMap = reflectionTexture?.uuid
        }
    }
)
