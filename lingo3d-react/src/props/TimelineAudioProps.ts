import ITimelineAudio from "lingo3d/lib/interface/ITimelineAudio"
import React from "react"

export type TimelineAudioProps = Partial<ITimelineAudio> & {
  children?: React.ReactNode
}
