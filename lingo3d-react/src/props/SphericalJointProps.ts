import ISphericalJoint from "lingo3d/lib/interface/ISphericalJoint"
import React from "react"

export type SphericalJointProps = Partial<ISphericalJoint> & {
  children?: React.ReactNode
}
