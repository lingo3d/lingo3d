import { event } from "@lincode/events"
import { debounceTrailing } from "@lincode/utils"
import { getPaused } from "../states/usePaused"

const [_emitKeyClear, onKeyClear] = event()
export { onKeyClear }

const emitKeyClear = debounceTrailing(_emitKeyClear)

window.addEventListener("blur", () => emitKeyClear())
window.addEventListener("focus", () => emitKeyClear())
document.addEventListener("visibilitychange", () => emitKeyClear())
getPaused(() => emitKeyClear())

const shiftMetaPressed = new Set<string>()
onKeyClear(() => shiftMetaPressed.clear())

let queueClear = false
const tryClear = () => {
    if (!queueClear) return
    queueClear = false
    emitKeyClear()
}

document.addEventListener("keydown", (e) => {
    tryClear()
    if (e.key === "Shift" || e.key === "Meta") shiftMetaPressed.add(e.key)
    if (shiftMetaPressed.has("Meta") && shiftMetaPressed.has("Shift")) {
        emitKeyClear()
        queueClear = true
    }
})
document.addEventListener("keyup", (e) => {
    if (e.key === "Shift" || e.key === "Meta") emitKeyClear()
})
document.addEventListener("mousedown", tryClear)
