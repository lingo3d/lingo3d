import ISvgMesh from "lingo3d/lib/interface/ISvgMesh"
import React from "react"

export type SvgMeshProps = Partial<ISvgMesh> & {
  children?: React.ReactNode
}
