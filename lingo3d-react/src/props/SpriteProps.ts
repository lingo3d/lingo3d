import ISprite from "lingo3d/lib/interface/ISprite"
import React from "react"

export type SpriteProps = Partial<ISprite> & {
  children?: React.ReactNode
}
