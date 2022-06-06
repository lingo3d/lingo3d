import { onAfterRender } from "lingo3d"
import React, { useContext, useLayoutEffect, useRef } from "react"
import ReactDOM from "react-dom"
import { ParentContext } from "../../../hooks/useManager"
import htmlContainer from "./htmlContainer"

interface HTMLProps {
    parent?: any,
    children: React.ReactNode
}

const HTML: React.FC<HTMLProps> = ({ children }) => {
    const parent = useContext(ParentContext)
    const divRef = useRef<HTMLDivElement>(null)
    
    useLayoutEffect(() => {
        const div = divRef.current
        if (!div || !parent) return

        let frustumVisibleOld = false

        const handle = onAfterRender(() => {
            const { frustumVisible } = parent
            
            if (frustumVisible !== frustumVisibleOld)
                div.style.display = frustumVisible ? "block" : "none"

            frustumVisibleOld = frustumVisible

            if (!frustumVisible) return
            
            div.style.transform = `translateX(${parent.clientX}px) translateY(${parent.clientY}px)`
        })
        return () => {
            handle.cancel()
        }
    }, [parent])

    return ReactDOM.createPortal(
        <div ref={divRef} style={{ display: "none" }}>
            {children}
        </div>
    , htmlContainer)
}

export default HTML