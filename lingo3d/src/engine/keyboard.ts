import { createEffect } from "@lincode/reactivity"
import { onKeyClear } from "../events/onKeyClear"
import { emitKeyDown } from "../events/onKeyDown"
import { emitKeyPress } from "../events/onKeyPress"
import { emitKeyUp } from "../events/onKeyUp"
import { keyPressSet } from "../collections/keyPressSet"
import { keyPressEmitSystem } from "../systems/keyPressEmitSystem"
import { getWorldMode } from "../states/useWorldMode"
import { worldModePtr } from "../pointers/worldModePtr"

const processKey = (str: string) => {
    str = str.length === 1 ? str.toLocaleLowerCase() : str
    if (str === " ") str = "Space"
    return str
}

createEffect(() => {
    if (worldModePtr[0] !== "default") {
        const handle = onKeyClear(() => keyPressSet.clear())
        const handleKeyDown = (e: KeyboardEvent) =>
            keyPressSet.add(processKey(e.key))
        const handleKeyUp = (e: KeyboardEvent) =>
            keyPressSet.delete(processKey(e.key))
        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)
        return () => {
            keyPressSet.clear()
            handle.cancel()
            document.addEventListener("keydown", handleKeyDown)
            document.addEventListener("keyup", handleKeyUp)
        }
    }
    keyPressEmitSystem.add(keyPressSet)
    const keyClear = () => {
        for (const key of keyPressSet) emitKeyUp(key)
        keyPressSet.clear()
    }
    const handle = onKeyClear(keyClear)

    const handleKeyDown = (e: KeyboardEvent): void => {
        const key = processKey(e.key)
        keyPressSet.add(key)
        emitKeyDown(key)
    }
    const handleKeyUp = (e: KeyboardEvent): void => {
        const key = processKey(e.key)
        keyPressSet.delete(key)
        emitKeyUp(key)
        !keyPressSet.size && emitKeyPress()
    }
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)

    return () => {
        keyClear()
        keyPressEmitSystem.delete(keyPressSet)
        handle.cancel()
        document.removeEventListener("keydown", handleKeyDown)
        document.removeEventListener("keyup", handleKeyUp)
    }
}, [getWorldMode])
