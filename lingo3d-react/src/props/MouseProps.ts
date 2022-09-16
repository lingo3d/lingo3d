import IMouse from "lingo3d/lib/interface/IMouse"
import React from "react"

export type MouseProps = Partial<IMouse> & {
  children?: React.ReactNode
}
