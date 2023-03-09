import { Point } from "@lincode/math"
import { signal, Signal } from "@preact/signals"

const gameGraphMenuSignal: Signal<(Point & { create?: boolean }) | undefined> =
    signal(undefined)

export default gameGraphMenuSignal
