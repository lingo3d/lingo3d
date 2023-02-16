import React from "react"
import { Timeline as GameTimeline } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { TimelineProps } from "../../props/TimelineProps"

const Timeline = React.forwardRef<GameTimeline, TimelineProps>((p, ref) => {
  const manager = useManager(p, ref, GameTimeline)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default Timeline
