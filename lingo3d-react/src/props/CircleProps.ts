import ICircle from "lingo3d/lib/interface/ICircle"
import React from "react"

export type CircleProps = Partial<ICircle> & {
  children?: React.ReactNode
}
