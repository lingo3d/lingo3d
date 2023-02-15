import IPrismaticJoint from "lingo3d/lib/interface/IPrismaticJoint"
import React from "react"

export type PrismaticJointProps = Partial<IPrismaticJoint> & {
  children?: React.ReactNode
}
