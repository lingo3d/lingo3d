import { Point } from "@lincode/math"
import store from "@lincode/reactivity"

export const [setTimelineContextMenu, getTimelineContextMenu] = store<
    | (Point & {
          keyframe?: boolean
          create?: "audio" | "timeline"
      })
    | undefined
>(undefined)
