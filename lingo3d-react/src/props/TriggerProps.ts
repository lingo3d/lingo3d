import ITrigger from "lingo3d/lib/interface/ITrigger"
import React from "react"

export type TriggerProps = Partial<ITrigger> & {
  children?: React.ReactNode
}
