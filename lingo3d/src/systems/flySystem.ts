import { keyPressSet } from "../collections/keyPressSet"
import GimbalObjectManager from "../display/core/GimbalObjectManager"
import createInternalSystem from "./utils/createInternalSystem"

export const flySystem = createInternalSystem("flySystem", {
    update: (manager: GimbalObjectManager) => {
        if (keyPressSet.has("Meta") || keyPressSet.has("Control")) return

        const speed = keyPressSet.has("Shift") ? 50 : 10

        if (keyPressSet.has("w")) manager.translateZ(-speed)
        else if (keyPressSet.has("s")) manager.translateZ(speed)

        if (keyPressSet.has("a") || keyPressSet.has("ArrowLeft"))
            manager.moveRight(-speed)
        else if (keyPressSet.has("d") || keyPressSet.has("ArrowRight"))
            manager.moveRight(speed)

        if (
            keyPressSet.has("w") ||
            keyPressSet.has("s") ||
            keyPressSet.has("a") ||
            keyPressSet.has("d")
        ) {
            const worldPos = manager.getWorldPosition()
            manager.innerZ = 0
            manager.placeAt(worldPos)
        }
        if (keyPressSet.has("Meta") || keyPressSet.has("Control")) return

        if (keyPressSet.has("ArrowDown")) manager.y -= speed
        else if (keyPressSet.has("ArrowUp")) manager.y += speed
    }
})
