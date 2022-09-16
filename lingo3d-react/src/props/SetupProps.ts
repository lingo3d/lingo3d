import ISetup from "lingo3d/lib/interface/ISetup"
import React from "react"

export type SetupProps = Partial<ISetup> & {
  children?: React.ReactNode
}
