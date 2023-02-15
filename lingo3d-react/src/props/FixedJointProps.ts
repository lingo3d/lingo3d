import IFixedJoint from "lingo3d/lib/interface/IFixedJoint"
import React from "react"

export type FixedJointProps = Partial<IFixedJoint> & {
  children?: React.ReactNode
}
