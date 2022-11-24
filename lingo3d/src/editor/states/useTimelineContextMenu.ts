import { Point } from "@lincode/math"
import preactStore from "../utils/preactStore"

export const [useTimelineContextMenu, setTimelineContextMenu] = preactStore<
    | (Point & {
          keyframe?: boolean
          create?: "audio" | "timeline"
      })
    | undefined
>(undefined)
