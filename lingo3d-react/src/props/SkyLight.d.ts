import ISkyLight from "lingo3d/lib/interface/ISkyLight"
import React from "react"

export type SkyLightProps = Partial<ISkyLight> & {
  children?: React.ReactNode
}
