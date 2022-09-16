import IReflector from "lingo3d/lib/interface/IReflector"
import React from "react"

export type ReflectorProps = Partial<IReflector> & {
  children?: React.ReactNode
}
