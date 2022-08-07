import { useLayoutEffect, useState } from "react"

export default () => {
  const [scroll, setScroll] = useState({ x: window.scrollX, y: window.scrollY })

  useLayoutEffect(() => {
    const cb = () => setScroll({ x: window.scrollX, y: window.scrollY })
    document.addEventListener("scroll", cb, { passive: true })
    return () => {
      document.removeEventListener("scroll", cb)
    }
  }, [])

  return scroll
}
