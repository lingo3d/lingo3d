import { useCurrentRef } from "@lincode/hooks"
import { Keyboard } from "lingo3d"
import { useLayoutEffect, useRef, useState } from "react"

export default (cb?: (key: string) => void) => {
    const statusRef = useRef<string>()
    const [, render] = useState({})
    const cbCurrentRef = useCurrentRef(cb)

    useLayoutEffect(() => {
        const keyboard = new Keyboard()

        keyboard.onKeyDown = k => {
            if (statusRef.current === k) return
            statusRef.current = k
            render({})
        }

        keyboard.onKeyUp = () => {
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