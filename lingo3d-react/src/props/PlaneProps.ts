import IPlane from "lingo3d/lib/interface/IPlane"
import React from "react"

export type PlaneProps = Partial<IPlane> & {
  children?: React.ReactNode
}
