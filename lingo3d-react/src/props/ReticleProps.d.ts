import IReticle from "lingo3d/lib/interface/IReticle"
import React from "react"

export type ReticleProps = Partial<IReticle> & {
  children?: React.ReactNode
}
