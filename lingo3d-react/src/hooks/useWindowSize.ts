import { useLayoutEffect, useState } from "react"

export default () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useLayoutEffect(() => {
    const cb = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener("resize", cb)

    return () => {
      window.removeEventListener("resize", cb)
    }
  }, [])

  return windowSize
}
