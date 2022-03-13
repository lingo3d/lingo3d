import React from "react"
import { SvgMesh as GameSvgMesh } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { SvgMeshProps } from "../../Props"

const SvgMesh = React.forwardRef<GameSvgMesh, SvgMeshProps>((p, ref) => {
    const manager = useManager(p, ref, GameSvgMesh)
    return <ParentContext.Provider value={manager}>{p.children}</ParentContext.Provider>
})

export default SvgMesh