import React from "react"
import { FixedJoint as GameFixedJoint } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { FixedJointProps } from "../../props/FixedJointProps"

const FixedJoint = React.forwardRef<GameFixedJoint, FixedJointProps>(
  (p, ref) => {
    const manager = useManager(p, ref, GameFixedJoint)
    return (
      <ParentContext.Provider value={manager}>
        {p.children}
      </ParentContext.Provider>
    )
  }
)

export default FixedJoint
