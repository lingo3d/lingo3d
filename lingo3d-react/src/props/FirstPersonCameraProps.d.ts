import IFirstPersonCamera from "lingo3d/lib/interface/IFirstPersonCamera"
import React from "react"

export type FirstPersonCameraProps = Partial<IFirstPersonCamera> & {
  children?: React.ReactNode
}
