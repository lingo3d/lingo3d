import ObjectManager from "../display/core/ObjectManager"
import createSystem from "./utils/createSystem"

export const flySystem = createSystem({
    data: {} as { downSet: Set<string> },
    update: (manager: ObjectManager, { downSet }) => {
        if (downSet.has("Meta") || downSet.has("Control")) return

        const speed = downSet.has("Shift") ? 50 : 10

        if (downSet.has("w")) manager.translateZ(-speed)
        else if (downSet.has("s")) manager.translateZ(speed)

        if (downSet.has("a") || downSet.has("ArrowLeft"))
            manager.moveRight(-speed)
        else if (downSet.has("d") || downSet.has("ArrowRight"))
            manager.moveRight(speed)

        if (
            downSet.has("w") ||
            downSet.has("s") ||
            downSet.has("a") ||
            downSet.has("d")
        ) {
            const worldPos = manager.getWorldPosition()
            manager.innerZ = 0
            manager.placeAt(worldPos)
        }
        if (downSet.has("Meta") || downSet.has("Control")) return

        if (downSet.has("ArrowDown")) manager.y -= speed
        else if (downSet.has("ArrowUp")) manager.y += speed
    }
})
