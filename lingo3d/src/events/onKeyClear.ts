import { event } from "@lincode/events"

const [emitKeyClear, onKeyClear] = event()
export { onKeyClear }

window.addEventListener("blur", () => emitKeyClear())
window.addEventListener("focus", () => emitKeyClear())
document.addEventListener("visibilitychange", () => emitKeyClear())

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
