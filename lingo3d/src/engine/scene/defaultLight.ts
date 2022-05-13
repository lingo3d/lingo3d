import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { HemisphereLight, DirectionalLight, EquirectangularReflectionMapping } from "three"
import loadTexture from "../../display/utils/loaders/loadTexture"
import { getDefaultLight } from "../../states/useDefaultLight"
import { getDefaultLightScale } from "../../states/useDefaultLightScale"
import scene from "./scene"

export default {}

createEffect(() => {
    const defaultLight = getDefaultLight()
    if (!defaultLight) return

    const scale = getDefaultLightScale()

    if (typeof defaultLight === "string") {
        if (defaultLight === "studio") {
            const handle = new Cancellable()
            ;(async () => {
                const AreaLight = (await import("../../display/lights/AreaLight")).default
                if (handle.done) return
                
                handle.watch(Object.assign(new AreaLight(), {
                    width: 1000, height: 1000, scale, innerY: 1000 * scale, innerRotationX: -90, intensity: 3
                }))
                handle.watch(Object.assign(new AreaLight(), {
                    width: 1000, height: 1000, scale, innerY: 1000 * scale, innerRotationX: -90, rotationX: 90, intensity: 3
                }))
                handle.watch(Object.assign(new AreaLight(), {
                    width: 1000, height: 1000, scale, innerY: 1000 * scale, innerRotationX: -90, rotationX: -90, intensity: 3
                }))
                handle.watch(Object.assign(new AreaLight(), {
                    width: 1000, height: 1000, scale, innerY: 1000 * scale, innerRotationX: -90, rotationZ: 90, intensity: 3
                }))
                handle.watch(Object.assign(new AreaLight(), {
                    width: 1000, height: 1000, scale, innerY: 1000 * scale, innerRotationX: -90, rotationZ: -90, intensity: 3
                }))
            })()
            return () => {
                handle.cancel()
            }
        }
        let proceed = true
        const texture = loadTexture(defaultLight, () => proceed && (scene.environment = texture))
        texture.mapping = EquirectangularReflectionMapping
        return () => {
            proceed = false
            scene.environment = null
        }
    }

    const skylight = new HemisphereLight(0xffffff, 0x666666, 1)
    scene.add(skylight)

    const light = new DirectionalLight(0xffffff, 0.5)
    light.position.set(0, 1, 1)
    scene.add(light)
    // light.castShadow = true
    // light.shadow.camera.near = camNear
    // light.shadow.camera.far = camFar

    return () => {
        skylight.dispose()
        scene.remove(skylight)

        light.dispose()
        scene.remove(light)
    }
}, [getDefaultLight, getDefaultLightScale])