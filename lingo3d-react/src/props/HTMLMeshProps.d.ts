import IHTMLMesh from "lingo3d/lib/interface/IHTMLMesh"
import React from "react"

export type HTMLMeshProps = Partial<IHTMLMesh> & {
  children?: React.ReactNode
}
