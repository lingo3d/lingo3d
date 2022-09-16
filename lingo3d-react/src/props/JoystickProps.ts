import IJoystick from "lingo3d/lib/interface/IJoystick"
import React from "react"

export type JoystickProps = Partial<IJoystick> & {
  children?: React.ReactNode
}
