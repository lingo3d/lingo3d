import { onBeforeRender } from "lingo3d"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import React, { PropsWithChildren, useLayoutEffect, useRef, useState } from "react"

export const FrameContext = React.createContext<
  Array<ObjectManager> | undefined
>(undefined)

interface FrameProps {
  className?: string
  style?: React.CSSProperties
}

const Frame: React.FC<FrameProps & PropsWithChildren> = ({ children, className, style }) => {
  const [frameObjects] = useState<Array<ObjectManager>>([])
  const elRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = elRef.current
    if (!el) return

    const handle = onBeforeRender(() => {
      const bounds = el.getBoundingClientRect()
      bounds
    })
    return () => {
      handle.cancel()
    }
  }, [frameObjects])

  return (
    <div ref={elRef} className={className} style={style}>
      <FrameContext.Provider value={frameObjects}>
        {children}
      </FrameContext.Provider>
    </div>
  )
}

export default Frame
