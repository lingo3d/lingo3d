import Model from "../display/Model"
import mathFn from "../math/mathFn"
import loadJSON from "../display/utils/loaders/loadJSON"
import deserialize from "../api/serializer/deserialize"
import { getAppendablesById } from "../collections/uuidCollections"
import { PointLight, settings } from ".."
import { getWorldPlayComputed } from "../states/useWorldPlayComputed"

const data: any = await loadJSON("car/bentley2.json")
deserialize(data)

const [found] = getAppendablesById("car")
const model = found as Model

const light = new PointLight()
light.x = 0
light.y = 50
light.z = 0
light.helper = false
light.castShadow = true

setTimeout(() => settings.grid = false)

getWorldPlayComputed((play) => {
    model.onLoad = async () => {
        if (play) {
            for (const part of getAppendablesById("exp") as any) {
                const direction = mathFn.normalize(part.getCenter())
                direction.x = direction.x * mathFn.randomRange(0.5, 1.5)
                direction.y = direction.y * mathFn.randomRange(1.5, 2)
                direction.z = direction.z * mathFn.randomRange(0.5, 1.5)
                if (part.name === "Object_74") {
                    direction.x = 0
                    direction.y = 0
                    direction.z = -4
                } else if (part.name === "Object_10") direction.y = 2
                const { x, y, z } = mathFn.multiply(direction, 50)
                part.lerpTo(x, y, z)
                await new Promise<void>((resolve) => setTimeout(resolve, 10))
            }
        } else {
            for (const part of getAppendablesById("exp") as any) {
                part.lerpTo(0, 0, 0)
                await new Promise<void>((resolve) => setTimeout(resolve, 10))
            }
        }
    }
})
