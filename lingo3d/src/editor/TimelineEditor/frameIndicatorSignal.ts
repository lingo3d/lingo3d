import { Point } from "@lincode/math"
import { signal } from "@preact/signals"
import { getTimelineLayer } from "../../states/useTimelineLayer"

export const frameIndicatorSignal = signal<Point | undefined>(undefined)
getTimelineLayer(() => (frameIndicatorSignal.value = undefined))
