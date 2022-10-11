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
appendableRoot.delete(defaultEnvironment)
defaultEnvironment.helper = false

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
        appendableRoot.delete(light)
        light.helper = false
        light.intensity = 0.7
        handle.then(() => light.dispose())
    })
    import("../display/lights/DirectionalLight").then((module) => {
        const DirectionalLight = module.default
        const light = new DirectionalLight()
        appendableRoot.delete(light)
        light.helper = false
        light.y = FAR
        light.z = FAR
        light.intensity = 0.5
        handle.then(() => light.dispose())

        if (!getCentripetal()) return

        const light2 = new DirectionalLight()
        appendableRoot.delete(light2)
        light2.helper = false
        light2.y = -FAR
        light2.z = -FAR
        light2.intensity = 0.5
        handle.then(() => light2.dispose())
    })

    return () => {
        handle.cancel()
    }
}, [getDefaultLight, getCentripetal])
