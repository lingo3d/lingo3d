import IPointLight from "lingo3d/lib/interface/IPointLight"
import React from "react"

export type PointLightProps = Partial<IPointLight> & {
  children?: React.ReactNode
}
