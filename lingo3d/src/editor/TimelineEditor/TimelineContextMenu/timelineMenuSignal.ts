import { Point } from "@lincode/math"
import { signal, Signal } from "@preact/signals"

const timelineMenuSignal: Signal<
    | (Point & {
          keyframe?: boolean
          create?: "audio" | "timeline"
      })
    | undefined
> = signal(undefined)

export default timelineMenuSignal
