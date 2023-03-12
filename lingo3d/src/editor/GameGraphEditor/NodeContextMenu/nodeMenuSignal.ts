import { Point } from "@lincode/math"
import { signal, Signal } from "@preact/signals"

const nodeMenuSignal: Signal<Point | undefined> = signal(undefined)
export default nodeMenuSignal
