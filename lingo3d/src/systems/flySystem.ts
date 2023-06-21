import { keyPressSet } from "../collections/keyPressSet"
import GimbalObjectManager from "../display/core/GimbalObjectManager"
import createInternalSystem from "./utils/createInternalSystem"

export const flySystem = createInternalSystem("flySystem", {
    update: (manager: GimbalObjectManager) => {
        if (keyPressSet.has("Meta") || keyPressSet.has("Control")) return

        const speed = keyPressSet.has("Shift") ? 50 : 10
        let pressed = false

        if (keyPressSet.has("w")) {
            manager.translateZ(-speed)
            pressed = true
        } else if (keyPressSet.has("s")) {
            manager.translateZ(speed)
            pressed = true
        }
        if (keyPressSet.has("a") || keyPressSet.has("ArrowLeft")) {
            manager.moveRight(-speed)
            pressed = true
        } else if (keyPressSet.has("d") || keyPressSet.has("ArrowRight")) {
            manager.moveRight(speed)
            pressed = true
        }
        if (keyPressSet.has("ArrowDown")) {
            manager.y -= speed
            pressed = true
        } else if (keyPressSet.has("ArrowUp")) {
            manager.y += speed
            pressed = true
        }
        if (!pressed || !manager.innerZ) return
        
        const worldPos = manager.getWorldPosition()
        manager.innerZ = 0
        manager.placeAt(worldPos)
    }
})
