import ISkybox from "lingo3d/lib/interface/ISkybox"
import React from "react"

export type SkyboxProps = Partial<ISkybox> & {
  children?: React.ReactNode
}
