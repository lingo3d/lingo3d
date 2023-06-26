import { signal } from "@preact/signals"

export const sceneGraphWidthSignal = signal(0)
export const editorWidthSignal = signal(0)

const handleResize = () => {
    sceneGraphWidthSignal.value = Math.max(window.innerWidth * 0.15, 200)
    editorWidthSignal.value = Math.max(window.innerWidth * 0.18, 300)
}
window.addEventListener("resize", handleResize)
handleResize()
