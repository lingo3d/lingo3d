import IModel from "lingo3d/lib/interface/IModel"
import React from "react"

export type ModelProps = Partial<IModel> & {
  children?: React.ReactNode
}
