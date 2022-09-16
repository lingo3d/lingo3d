import IPrimitive from "lingo3d/lib/interface/IPrimitive"
import React from "react"

export type PrimitiveProps = Partial<IPrimitive> & {
  children?: React.ReactNode
}
