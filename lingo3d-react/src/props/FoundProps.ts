import IFoundManager from "lingo3d/lib/interface/IFoundManager"
import React from "react"

export type FoundProps = Partial<IFoundManager> & { children?: React.ReactNode }
