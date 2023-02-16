import IDefaultSkyLight from "lingo3d/lib/interface/IDefaultSkyLight"
import React from "react"

export type DefaultSkyLightProps = Partial<IDefaultSkyLight> & {
  children?: React.ReactNode
}
