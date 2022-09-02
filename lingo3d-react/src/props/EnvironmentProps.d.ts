import IEnvironment from "lingo3d/lib/interface/IEnvironment"
import React from "react"

export type EnvironmentProps = Partial<IEnvironment> & {
  children?: React.ReactNode
}
