import ITimeline from "lingo3d/lib/interface/ITimeline"
import React from "react"

export type TimelineProps = Partial<ITimeline> & {
  children?: React.ReactNode
}
