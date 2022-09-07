import ISpotLight from "lingo3d/lib/interface/ISpotLight"
import React from "react"

export type SpotLightProps = Partial<ISpotLight> & {
  children?: React.ReactNode
}
