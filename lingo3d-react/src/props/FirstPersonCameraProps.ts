import ICharacterCamera from "lingo3d/lib/interface/ICharacterCamera"
import React from "react"

export type FirstPersonCameraProps = Partial<ICharacterCamera> & {
  children?: React.ReactNode
}
