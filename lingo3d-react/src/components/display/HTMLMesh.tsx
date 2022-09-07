import React, { useLayoutEffect, useRef } from "react"
import { HTMLMesh as GameHTMLMesh } from "lingo3d"
import useManager, { ParentContext } from "../../hooks/useManager"
import { HTMLMeshProps } from "../../props/HTMLMeshProps"

const HTMLMesh = React.forwardRef<GameHTMLMesh, HTMLMeshProps>((p, ref) => {
  const manager = useManager(p, ref, GameHTMLMesh)
  const divRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    manager.element = divRef.current
  }, [])

  return (
    <ParentContext.Provider value={manager}>
      <div ref={divRef}>{p.children}</div>
    </ParentContext.Provider>
  )
})

export default HTMLMesh
