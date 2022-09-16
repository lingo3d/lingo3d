import ISpawnPoint from "lingo3d/lib/interface/ISpawnPoint"
import React from "react"

export type SpawnPointProps = Partial<ISpawnPoint> & {
  children?: React.ReactNode
}
