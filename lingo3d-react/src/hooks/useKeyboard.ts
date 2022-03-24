import { useCurrentRef } from "@lincode/hooks"
import { Keyboard } from "lingo3d"
import { isPressed } from "lingo3d/lib/api/keyboard"
import { useLayoutEffect, useRef, useState } from "react"

export default (cb?: (key: string) => void) => {
    const statusRef = useRef<string>()
    const [, render] = useState({})
    const cbCurrentRef = useCurrentRef(cb)

    useLayoutEffect(() => {
        const keyboard = new Keyboard()
        let latestKey = ""

        keyboard.onKeyDown = k => {
            if (latestKey === k) return
            latestKey = k
            statusRef.current = [...isPressed].join(" ")
            render({})
        }

        keyboard.onKeyUp = () => {
            latestKey = ""
            statusRef.current = undefined
            render({})
        }

        keyboard.onKeyPress = k => cbCurrentRef.current?.(k)

        return () => {
            keyboard.dispose()
        }
    }, [])

    return statusRef.current
}