import { Signal, signal } from "@preact/signals"
import { getTimelineLayer } from "../../states/useTimelineLayer"
import { PointType } from "../../typeGuards/isPoint"

export const frameIndicatorSignal: Signal<PointType | undefined> = signal<
    PointType | undefined
>(undefined)

getTimelineLayer(() => (frameIndicatorSignal.value = undefined))
