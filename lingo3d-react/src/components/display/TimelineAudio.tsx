import React from "react"
import { TimelineAudio as GameTimelineAudio } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { TimelineAudioProps } from "../../props/TimelineAudioProps"

const TimelineAudio = React.forwardRef<GameTimelineAudio, TimelineAudioProps>((p, ref) => {
  const manager = useManager(p, ref, GameTimelineAudio)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default TimelineAudio
