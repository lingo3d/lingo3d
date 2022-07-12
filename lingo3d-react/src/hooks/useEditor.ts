import { render, h as preactH } from "preact"
import "lingo3d/lib/editor"
import { useLayoutEffect, useMemo, useRef } from "react"

export default (Component: any, props?: any, logical?: boolean) => {
  const tempDiv = useMemo(
    () => (logical ? document.createElement("div") : null),
    []
  )
  const divRef = useRef(tempDiv)

  useLayoutEffect(() => {
    const el = divRef.current
    if (!el) return

    render(preactH(Component, props, el), el)
  }, [props])

  useLayoutEffect(() => {
    const el = divRef.current
    if (!el) return

    return () => {
      render(undefined, el)
    }
  }, [])

  return divRef
}
