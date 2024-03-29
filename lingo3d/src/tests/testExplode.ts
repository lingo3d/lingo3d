import Model from "../display/Model"
import math from "../math"
import loadJSON from "../display/utils/loaders/loadJSON"
import deserialize from "../api/serializer/deserialize"
import { userIdMap } from "../collections/idCollections"
import { ThirdPersonCamera, onBeforeRender } from ".."
import HandTracker from "../display/HandTracker"
import { getWorldMode } from "../states/useWorldMode"
import { mapLinear, randFloat } from "three/src/math/MathUtils"
import multiplyScalar from "../math/multiplyScalar"

const data: any = await loadJSON("car/bentley2.json")
deserialize(data)

const [found] = userIdMap.get("car") ?? []
const model = found as Model

// const light = new PointLight()
// light.x = 0
// light.y = 50
// light.z = 0
// light.helper = false
// light.castShadow = true

const handTracker = new HandTracker()
handTracker.x = 150
handTracker.y = 100

model.onLoad = () => {
    const handle = getWorldMode((val) => {
        if (val === "default") {
            handle.cancel()
            handTracker.track = true
        }
    })

    const cam = new ThirdPersonCamera()
    cam.innerZ = 500
    cam.polarAngle = 100

    let gestureOld = ""
    let gesture = ""
    onBeforeRender(() => {
        if (
            gestureOld !== handTracker.gesture &&
            handTracker.gesture !== "None"
        ) {
            gesture = handTracker.gesture
            if (gesture === "Closed_Fist") {
                ;(async () => {
                    for (const part of userIdMap.get("exp") ?? []) {
                        if (!("$object" in part)) continue
                        const direction = math.normalize(
                            part.getWorldPosition()
                        )
                        direction.x = direction.x * randFloat(0.5, 1.5)
                        direction.y = direction.y * randFloat(1.5, 2)
                        direction.z = direction.z * randFloat(0.5, 1.5)
                        if (part.name === "Object_74") {
                            direction.x = 0
                            direction.y = 0
                            direction.z = -4
                        } else if (part.name === "Object_10") direction.y = 2
                        const { x, y, z } = multiplyScalar(direction, 50)
                        part.lerpTo(x, y, z)
                        await new Promise<void>((resolve) =>
                            setTimeout(resolve, 10)
                        )
                    }
                })()
            } else if (gesture === "Open_Palm") {
                ;(async () => {
                    for (const part of userIdMap.get("exp") ?? []) {
                        if (!("$object" in part)) continue
                        part.lerpTo(0, 0, 0)
                        await new Promise<void>((resolve) =>
                            setTimeout(resolve, 10)
                        )
                    }
                })()
            }
        }
        if (gesture === "Closed_Fist" || gesture === "Open_Palm") {
            cam.gyrate(mapLinear(handTracker.rotationY, -70, -80, -1, 1), 0)
        }
        gestureOld = handTracker.gesture
    })
}
