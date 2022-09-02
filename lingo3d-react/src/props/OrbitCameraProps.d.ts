import IOrbitCamera from "lingo3d/lib/interface/IOrbitCamera"
import React from "react"

export type OrbitCameraProps = Partial<IOrbitCamera> & {
  children?: React.ReactNode
}
