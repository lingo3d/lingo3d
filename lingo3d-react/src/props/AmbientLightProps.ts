import IAmbientLight from "lingo3d/lib/interface/IAmbientLight"
import React from "react"

export type AmbientLightProps = Partial<IAmbientLight> & {
  children?: React.ReactNode
}
