import React, { useLayoutEffect, useRef } from "react"
import { settings } from "lingo3d"
import ISetup from "lingo3d/lib/interface/ISetup"
import htmlContainer from "./logical/HTML/htmlContainer"
import Setup from "./display/Setup"

type WorldProps = Partial<ISetup> & {
  style?: React.CSSProperties
  className?: string
  position?: "absolute" | "relative" | "fixed"
  children?: React.ReactNode
}

const World: React.FC<WorldProps> = ({
  style,
  className,
  position,
  children,
  ...setupProps
}) => {
  const divRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = divRef.current
    if (!el) return

    el.appendChild(htmlContainer)
    settings.autoMount = el

    return () => {
      settings.autoMount = false
    }
  }, [])

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: position ?? "absolute",
          top: 0,
          left: 0,
          display: "flex",
          ...style
        }}
      >
        <div style={{ height: "100%" }}>{children}</div>
        <div
          ref={divRef}
          style={{
            height: "100%",
            flexGrow: 1,
            position: "relative",
            overflow: "hidden"
          }}
        />
      </div>
      <Setup {...setupProps} />
    </>
  )
}

export default World
