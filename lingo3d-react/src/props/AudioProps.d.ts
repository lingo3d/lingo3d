import IAudio from "lingo3d/lib/interface/IAudio"
import React from "react"

export type AudioProps = Partial<IAudio> & {
  children?: React.ReactNode
}
