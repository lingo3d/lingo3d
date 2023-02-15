import React from "react"
import { RevoluteJoint as GameRevoluteJoint } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { RevoluteJointProps } from "../../props/RevoluteJointProps"

const RevoluteJoint = React.forwardRef<GameRevoluteJoint, RevoluteJointProps>(
  (p, ref) => {
    const manager = useManager(p, ref, GameRevoluteJoint)
    return (
      <ParentContext.Provider value={manager}>
        {p.children}
      </ParentContext.Provider>
    )
  }
)

export default RevoluteJoint
