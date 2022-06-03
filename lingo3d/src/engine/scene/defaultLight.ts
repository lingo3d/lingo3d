import { createEffect } from "@lincode/reactivity"
import { HemisphereLight, DirectionalLight, EquirectangularReflectionMapping } from "three"
import loadTexture from "../../display/utils/loaders/loadTexture"
import { getDefaultLight } from "../../states/useDefaultLight"
import { getDefaultLightScale } from "../../states/useDefaultLightScale"
import scene from "./scene"

export default {}

createEffect(() => {
    let defaultLight = getDefaultLight()
    if (!defaultLight) return

    if (typeof defaultLight === "string" && defaultLight !== "default") {
        if (defaultLight === "studio")
            defaultLight = "https://unpkg.com/lingo3d-textures@1.0.0/assets/studio.jpg"

        const texture = loadTexture(defaultLight)
        texture.mapping = EquirectangularReflectionMapping
        scene.environment = texture
        return () => {
            scene.environment = null
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