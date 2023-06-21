import { keyPressSet } from "../collections/keyPressSet"
import CameraBase from "../display/core/CameraBase"
import createInternalSystem from "./utils/createInternalSystem"

export const flySystem = createInternalSystem("flySystem", {
    data: { pressed: false },
    update: (self: CameraBase, data) => {
        if (keyPressSet.has("Meta") || keyPressSet.has("Control")) return

        const speed = keyPressSet.has("Shift") ? 50 : 10
        let pressed = false

        if (keyPressSet.has("w")) {
            self.translateZ(-speed)
            pressed = true
        } else if (keyPressSet.has("s")) {
            self.translateZ(speed)
            pressed = true
        }
        if (keyPressSet.has("a") || keyPressSet.has("ArrowLeft")) {
            self.moveRight(-speed)
            pressed = true
        } else if (keyPressSet.has("d") || keyPressSet.has("ArrowRight")) {
            self.moveRight(speed)
            pressed = true
        }
        if (keyPressSet.has("ArrowDown")) {
            self.y -= speed
            pressed = true
        } else if (keyPressSet.has("ArrowUp")) {
            self.y += speed
            pressed = true
        }
        if (pressed && !data.pressed) {
            const worldPos = self.getWorldPosition()
            self.innerZ = 0
            self.placeAt(worldPos)
        }
        data.pressed = pressed
    }
})
