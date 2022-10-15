import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import { EquirectangularReflectionMapping } from "three"
import { appendableRoot } from "../api/core/Appendable"
import Environment from "../display/Environment"
import loadTexture from "../display/utils/loaders/loadTexture"
import { FAR, TEXTURES_URL } from "../globals"
import { getCentripetal } from "../states/useCentripetal"
import { getDefaultLight } from "../states/useDefaultLight"
import { getEnvironmentStack } from "../states/useEnvironmentStack"
import { getRenderer } from "../states/useRenderer"
import scene from "./scene"

const defaultEnvironment = new Environment()
defaultEnvironment.texture = undefined
defaultEnvironment.helper = false
appendableRoot.delete(defaultEnvironment)

createEffect(() => {
    const environment = last(getEnvironmentStack())
    const renderer = getRenderer()

    if (!environment?.texture || !renderer || environment.texture === "dynamic")
        return

    let proceed = true
    const texture = loadTexture(
        environment.texture === "studio"
            ? TEXTURES_URL + "studio.jpg"
            : environment.texture,
        () => proceed && (scene.environment = texture)
    )
    texture.mapping = EquirectangularReflectionMapping

    return () => {
        proceed = false
        scene.environment = null
    }
}, [getEnvironmentStack, getRenderer])

createEffect(() => {
    const defaultLight = getDefaultLight()
    if (!defaultLight) return

    if (typeof defaultLight === "string") {
        defaultEnvironment.texture = defaultLight
        return () => {
            defaultEnvironment.texture = undefined
        }
    }

    const handle = new Cancellable()

    import("../display/lights/SkyLight").then((module) => {
        const SkyLight = module.default
        const light = new SkyLight()
        light.helper = false
        light.intensity = 0.5
        light.y = FAR
        light.z = FAR

        handle.then(() => light.dispose())
    })

    return () => {
        handle.cancel()
    }
}, [getDefaultLight, getCentripetal])
