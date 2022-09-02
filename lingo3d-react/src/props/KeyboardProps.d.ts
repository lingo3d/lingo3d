import IKeyboard from "lingo3d/lib/interface/IKeyboard"
import React from "react"

export type KeyboardProps = Partial<IKeyboard> & {
  children?: React.ReactNode
}
