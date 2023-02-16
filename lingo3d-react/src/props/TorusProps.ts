import ITorus from "lingo3d/lib/interface/ITorus"
import React from "react"

export type TorusProps = Partial<ITorus> & {
  children?: React.ReactNode
}
