import { Mouse } from "lingo3d"
import { useLayoutEffect, useRef, useState } from "react"

type MouseStatus = { x: number, y: number, isDown: boolean }

export default () => {
    const statusRef = useRef<MouseStatus>({ x: 0, y: 0, isDown: false })
    const [, render] = useState({})

    useLayoutEffect(() => {
        const mouse = new Mouse()

        mouse.onMouseMove = () => {
            statusRef.current.x = mouse.x
            statusRef.current.y = mouse.y
            render({})
        }
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