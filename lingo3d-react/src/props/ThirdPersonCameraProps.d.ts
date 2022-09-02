import IThirdPersonCamera from "lingo3d/lib/interface/IThirdPersonCamera"
import React from "react"

export type ThirdPersonCameraProps = Partial<IThirdPersonCamera> & {
  children?: React.ReactNode
}
