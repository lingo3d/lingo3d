import { useCurrentRef } from "@lincode/hooks"
import { Keyboard } from "lingo3d"
import { isPressed } from "lingo3d/lib/api/keyboard"
import { useLayoutEffect, useState } from "react"

export default (cb?: (key: string) => void) => {
  const [keys, setKeys] = useState("")
  const cbCurrentRef = useCurrentRef(cb)

  useLayoutEffect(() => {
    const keyboard = new Keyboard()
    let latestKey = ""

    keyboard.onKeyDown = (e) => {
      if (latestKey === e.key) return
      latestKey = e.key
      setKeys([...isPressed].join(" "))
    }

    keyboard.onKeyUp = () => {
      latestKey = ""
      setKeys([...isPressed].join(" "))
    }

    keyboard.onKeyPress = (e) => cbCurrentRef.current?.(e.key)

    return () => {
      keyboard.dispose()
    }
  }, [])

  return keys
}
