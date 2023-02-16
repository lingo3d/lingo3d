import IFoundManager from "lingo3d/lib/interface/IFoundManager"
import React from "react"

export type FoundManagerProps = Partial<IFoundManager> & {
  children?: React.ReactNode
}
