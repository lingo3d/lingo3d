import IGroup from "lingo3d/lib/interface/IGroup"
import React from "react"

export type GroupProps = Partial<IGroup> & { children?: React.ReactNode }
