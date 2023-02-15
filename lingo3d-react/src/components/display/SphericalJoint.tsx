import React from "react"
import { SphericalJoint as GameSphericalJoint } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SphericalJointProps } from "../../props/SphericalJointProps"

const SphericalJoint = React.forwardRef<
  GameSphericalJoint,
  SphericalJointProps
>((p, ref) => {
  const manager = useManager(p, ref, GameSphericalJoint)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default SphericalJoint
