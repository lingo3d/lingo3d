import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { EquirectangularReflectionMapping } from "three"
import Environment from "../display/Environment"
import loadTexture from "../display/utils/loaders/loadTexture"
import { FAR, TEXTURES_URL } from "../globals"
import { environmentPreset } from "../interface/IEnvironment"
import { getDefaultLight } from "../states/useDefaultLight"
import { getEnvironment } from "../states/useEnvironment"
import { getEnvironmentStack } from "../states/useEnvironmentStack"
import { getRenderer } from "../states/useRenderer"
import scene from "./scene"
import { appendableRoot } from "../api/core/collections"
import unsafeGetValue from "../utils/unsafeGetValue"

const defaultEnvironment = new Environment()
defaultEnvironment.texture = undefined
defaultEnvironment.helper = false
appendableRoot.delete(defaultEnvironment)

export const environmentToUrl = (value: string) =>
    value in environmentPreset
        ? TEXTURES_URL + unsafeGetValue(environmentPreset, value)
        : value

createEffect(() => {
    const environment = getEnvironmentStack().at(-1)
    const renderer = getRenderer()

    if (!environment?.texture || !renderer || environment.texture === "dynamic")
        return

    let proceed = true
    const texture = loadTexture(
        environmentToUrl(environment.texture),
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
    if (!defaultLight || typeof defaultLight === "string") return

    const handle = new Cancellable()
    import("../display/lights/SkyLight").then((module) => {
        const SkyLight = module.default
        const light = new SkyLight()
        light.helper = false
        light.y = FAR
        light.z = FAR
        light.name = "defaultSkyLight"
        handle.then(() => light.dispose())
    })
    return () => {
        handle.cancel()
    }
}, [getDefaultLight])

createEffect(() => {
    const defaultLight = getDefaultLight()
    const environment =
        typeof defaultLight === "string" ? defaultLight : getEnvironment()
    if (!environment) return

    defaultEnvironment.texture = environment
    return () => {
        defaultEnvironment.texture = undefined
    }
}, [getEnvironment, getDefaultLight])
