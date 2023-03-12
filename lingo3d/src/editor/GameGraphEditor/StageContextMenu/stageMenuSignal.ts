import { Point } from "@lincode/math"
import { signal, Signal } from "@preact/signals"

const stageMenuSignal: Signal<(Point & { create?: boolean }) | undefined> =
    signal(undefined)

export default stageMenuSignal
