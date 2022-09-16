import ICamera from "lingo3d/lib/interface/ICamera"
import React from "react"

export type CameraProps = Partial<ICamera> & {
  children?: React.ReactNode
}
