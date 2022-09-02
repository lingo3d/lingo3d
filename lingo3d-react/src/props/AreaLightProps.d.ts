import IAreaLight from "lingo3d/lib/interface/IAreaLight"
import React from "react"

export type AreaLightProps = Partial<IAreaLight> & {
  children?: React.ReactNode
}
