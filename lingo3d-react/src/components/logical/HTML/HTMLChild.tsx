import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import React, { useLayoutEffect, useRef } from "react"

interface HTMLChildProps {
    el: React.ReactNode
    manager: ObjectManager
}

const style = { position: "absolute", left: 0, top: 0, display: "none" } as const

const HTMLChild: React.FC<HTMLChildProps> = ({ el, manager }) => {
    const divRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const div = divRef.current
        if (!div) return

        let frustumVisibleOld = false

        const handle = manager.loop(() => {
            const { frustumVisible } = manager
            
            if (frustumVisible !== frustumVisibleOld)
                div.style.display = frustumVisible ? "block" : "none"

            frustumVisibleOld = frustumVisible

            if (!frustumVisible) return
            
            div.style.transform = `translateX(${manager.clientX}px) translateY(${manager.clientY}px)`
        })
        return () => {
            handle.cancel()
        }
    }, [])

    return (
        <div style={style} ref={divRef}>{el}</div>
    )
}

export default HTMLChild
