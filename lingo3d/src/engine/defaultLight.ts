import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import { EquirectangularReflectionMapping } from "three"
import { appendableRoot } from "../api/core/Appendable"
import Environment from "../display/Environment"
import loadTexture from "../display/utils/loaders/loadTexture"
import { FAR, TEXTURES_URL } from "../globals"
import { environmentPreset } from "../interface/IEnvironment"
import { getDefaultShadow } from "../states/defaultShadow"
import { getCentripetal } from "../states/useCentripetal"
import { getDefaultLight } from "../states/useDefaultLight"
import { getEnvironment } from "../states/useEnvironment"
import { getEnvironmentStack } from "../states/useEnvironmentStack"
import { getRenderer } from "../states/useRenderer"
import scene from "./scene"

const defaultEnvironment = new Environment()
defaultEnvironment.texture = undefined
defaultEnvironment.helper = false
appendableRoot.delete(defaultEnvironment)

export const mapEnvironmentPreset = (value: string) =>
    value in environmentPreset
        ? TEXTURES_URL + (environmentPreset as any)[value]
        : value

createEffect(() => {
    const environment = last(getEnvironmentStack())
    const renderer = getRenderer()

    if (!environment?.texture || !renderer || environment.texture === "dynamic")
        return

    let proceed = true
    const texture = loadTexture(
        mapEnvironmentPreset(environment.texture),
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
        light.intensity = 0.5
        light.y = FAR
        light.z = FAR
        appendableRoot.delete(light)
        handle.watch(getDefaultShadow((val) => (light.castShadow = val)))
        handle.then(() => light.dispose())
    })
    return () => {
        handle.cancel()
    }
}, [getDefaultLight, getCentripetal])

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
