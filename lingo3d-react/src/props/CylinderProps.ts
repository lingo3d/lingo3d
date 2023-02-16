import ICylinder from "lingo3d/lib/interface/ICylinder"
import React from "react"

export type CylinderProps = Partial<ICylinder> & {
  children?: React.ReactNode
}
