import React, { PropsWithChildren } from "react"
import ReactDOM from "react-dom"
import htmlContainer from "./HTML/htmlContainer"

const UI: React.FC<PropsWithChildren> = ({ children }) => {
    return ReactDOM.createPortal(
        <div style={{ pointerEvents: "all", position: "static" }}>
            {children}
        </div>
    , htmlContainer)
}

export default UI
