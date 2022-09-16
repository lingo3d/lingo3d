import { clientToWorld, Group as LingoGroup, onBeforeRender } from "lingo3d"
import React, { useLayoutEffect, useRef } from "react"
import Group from "../display/Group"

interface FrameProps {
  className?: string
  style?: React.CSSProperties
  distance?: number
  children?: React.ReactNode
}

const Frame: React.FC<FrameProps> = ({
  children,
  className,
  style,
  distance = 500
}) => {
  const elRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<LingoGroup>(null)

  useLayoutEffect(() => {
    const el = elRef.current
    const group = groupRef.current
    if (!el || !group) return

    const handle = onBeforeRender(() => {
      const { left, top, width, height } = el.getBoundingClientRect()
      const clientX = left + width * 0.5
      const clientY = top + height * 0.5
      group.placeAt(clientToWorld(clientX, clientY, distance))
    })
    return () => {
      handle.cancel()
    }
  }, [distance])

  return (
    <div ref={elRef} className={className} style={style}>
      <Group ref={groupRef}>{children}</Group>
    </div>
  )
}

export default Frame
