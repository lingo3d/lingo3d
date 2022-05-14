import { event } from "@lincode/events"

const [emitKeyClear, onKeyClear] = event()
export { onKeyClear }

window.addEventListener("blur", () => emitKeyClear())
window.addEventListener("focus", () => emitKeyClear())
document.addEventListener("visibilitychange", () => emitKeyClear())

const isPressed = new Set<string>()
onKeyClear(() => isPressed.clear())

let queueMouseDownClear = false
document.addEventListener("keydown", e => {
    if (e.key === "Shift" || e.key === "Meta")
        isPressed.add(e.key)
        
    if (isPressed.has("Meta") && isPressed.has("Shift")) {
        emitKeyClear()
        queueMouseDownClear = true
    }
})
document.addEventListener("keyup", e => {
    if (e.key === "Shift" || e.key === "Meta")
        isPressed.delete(e.key)
})
document.addEventListener("mousedown", () => {
    if (queueMouseDownClear) {
        queueMouseDownClear = false
        emitKeyClear()
    }
})