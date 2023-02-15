import React from "react"
import { D6Joint as GameD6Joint } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { D6JointProps } from "../../props/D6JointProps"

const D6Joint = React.forwardRef<GameD6Joint, D6JointProps>((p, ref) => {
  const manager = useManager(p, ref, GameD6Joint)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default D6Joint
