import IDummy from "lingo3d/lib/interface/IDummy"
import React from "react"

export type DummyProps = Partial<IDummy> & {
  children?: React.ReactNode
}
