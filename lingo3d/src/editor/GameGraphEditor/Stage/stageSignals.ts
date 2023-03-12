import { Point } from "@lincode/math"
import { signal, computed, Signal, ReadonlySignal } from "@preact/signals"

export const boundsSignal: Signal<DOMRect> = signal(new DOMRect())
export const originSignal: ReadonlySignal<Point> = computed(
    () => new Point(boundsSignal.value.x * 0.5, boundsSignal.value.y * 0.5)
)
export const txSignal = signal(0)
export const tySignal = signal(0)
export const zoomSignal = signal(0.75)

export const getStagePosition = (clientX: number, clientY: number) => {
    const x =
        (clientX -
            boundsSignal.value.left -
            txSignal.value -
            originSignal.value.x) /
            zoomSignal.value +
        originSignal.value.x
    const y =
        (clientY -
            boundsSignal.value.top -
            tySignal.value -
            originSignal.value.y) /
            zoomSignal.value +
        originSignal.value.y
    return { x, y }
}
