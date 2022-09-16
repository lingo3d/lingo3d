import IWater from "lingo3d/lib/interface/IWater"
import React from "react"

export type WaterProps = Partial<IWater> & {
  children?: React.ReactNode
}
