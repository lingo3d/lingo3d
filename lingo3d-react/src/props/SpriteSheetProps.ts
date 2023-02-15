import ISpriteSheet from "lingo3d/lib/interface/ISpriteSheet"
import React from "react"

export type SpriteSheetProps = Partial<ISpriteSheet> & {
  children?: React.ReactNode
}
