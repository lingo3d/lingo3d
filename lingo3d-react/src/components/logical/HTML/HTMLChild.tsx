import { hook } from "@lincode/react-global-state"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { getCamera, setCamera } from "lingo3d/lib/states/useCamera"
import React, { useLayoutEffect, useRef } from "react"

const useCamera = hook(setCamera, getCamera)

interface HTMLChildProps {
    el: React.ReactNode
    manager: ObjectManager
}

const HTMLChild: React.FC<HTMLChildProps> = ({ el, manager }) => {
    const divRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const div = divRef.current
        if (!div) return

        const handle = manager.loop(() => {
            div.style.transform = `translateX(${manager.clientX}px) translateY(${manager.clientY}px)`
        })
        return () => {
            handle.cancel()
        }
    })

    return (
        <div style={{ position: "absolute", left: 0, top: 0 }} ref={divRef}>{el}</div>
    )
}

export default HTMLChild
