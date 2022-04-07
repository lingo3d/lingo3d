import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import React, { useLayoutEffect, useRef } from "react"

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
