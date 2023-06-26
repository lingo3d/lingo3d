import { Signal, signal } from "@preact/signals"

export const sceneGraphWidthSignal: Signal<number> = signal(0)
export const editorWidthSignal: Signal<number> = signal(0)

const handleResize = () => {
    sceneGraphWidthSignal.value = Math.max(window.innerWidth * 0.15, 200)
    editorWidthSignal.value = Math.max(window.innerWidth * 0.18, 300)
}
window.addEventListener("resize", handleResize)
handleResize()
