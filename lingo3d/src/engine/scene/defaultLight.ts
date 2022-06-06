import { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import { HemisphereLight, DirectionalLight, EquirectangularReflectionMapping } from "three"
import { appendableRoot } from "../../api/core/Appendable"
import Environment from "../../display/Environment"
import loadTexture from "../../display/utils/loaders/loadTexture"
import { getDefaultLight } from "../../states/useDefaultLight"
import { getDefaultLightScale } from "../../states/useDefaultLightScale"
import { getEnvironmentStack } from "../../states/useEnvironmentStack"
import scene from "./scene"

export default {}

const defaultEnvironment = new Environment()
appendableRoot.delete(defaultEnvironment)

createEffect(() => {
    const environment = last(getEnvironmentStack())?.texture
    if (!environment) return

    let proceed = true
    const texture = loadTexture(environment, () => proceed && (scene.environment = texture))
    texture.mapping = EquirectangularReflectionMapping
    
    return () => {
        proceed = false
        scene.environment = null
    }
}, [getEnvironmentStack])

createEffect(() => {
    const defaultLight = getDefaultLight()
    if (!defaultLight) return

    if (typeof defaultLight === "string" && defaultLight !== "default") {
        if (defaultLight === "studio")
            defaultEnvironment.texture = "https://unpkg.com/lingo3d-textures@1.0.0/assets/studio.jpg"
        else
            defaultEnvironment.texture = defaultLight

        return () => {
            defaultEnvironment.texture = undefined
        }
    }

    const skylight = new HemisphereLight(0xffffff, 0x666666)
    scene.add(skylight)

    const light = new DirectionalLight(0xffffff, 0.5)
    light.position.set(0, 1, 1)
    scene.add(light)

    const handle = getDefaultLightScale(scale => {
        skylight.intensity = scale
        light.intensity = scale * 0.5
    })

    // light.castShadow = true
    // light.shadow.camera.near = camNear
    // light.shadow.camera.far = camFar

    return () => {
        skylight.dispose()
        scene.remove(skylight)

        light.dispose()
        scene.remove(light)

        handle.cancel()
    }
}, [getDefaultLight])