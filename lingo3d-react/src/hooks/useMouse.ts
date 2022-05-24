import { Mouse } from "lingo3d"
import { useLayoutEffect, useRef, useState } from "react"

type MouseStatus = { isDown: boolean }

export default () => {
    const statusRef = useRef<MouseStatus>({ isDown: false })
    const [, render] = useState({})

    useLayoutEffect(() => {
        const mouse = new Mouse()

        mouse.onMouseDown = () => {
            statusRef.current.isDown = true
            render({})
        }
        mouse.onMouseUp = () => {
            statusRef.current.isDown = false
            render({})
        }

        return () => {
            mouse.dispose()
        }
    }, [])

    return statusRef.current
}