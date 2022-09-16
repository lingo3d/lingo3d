import IDirectionalLight from "lingo3d/lib/interface/IDirectionalLight"
import React from "react"

export type DirectionalLightProps = Partial<IDirectionalLight> & {
  children?: React.ReactNode
}
