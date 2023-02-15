import IRevoluteJoint from "lingo3d/lib/interface/IRevoluteJoint"
import React from "react"

export type RevoluteJointProps = Partial<IRevoluteJoint> & {
  children?: React.ReactNode
}
