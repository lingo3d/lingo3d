import React from "react"
import { PrismaticJoint as GamePrismaticJoint } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { PrismaticJointProps } from "../../props/PrismaticJointProps"

const PrismaticJoint = React.forwardRef<
  GamePrismaticJoint,
  PrismaticJointProps
>((p, ref) => {
  const manager = useManager(p, ref, GamePrismaticJoint)
  return (
    <ParentContext.Provider value={manager}>
      {p.children}
    </ParentContext.Provider>
  )
})

export default PrismaticJoint
