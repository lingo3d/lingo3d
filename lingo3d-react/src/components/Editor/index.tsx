import React from "react"
import Toolbar from "./Toolbar"
import TweakPane from "./TweakPane"

interface EditorProps {
    position?: "absolute" | "relative" | "fixed"
}

const Editor: React.FC<EditorProps> = ({ position }) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh",
            position: position ?? "fixed",
            left: 0,
            top: 0,
            userSelect: "none",
            backgroundColor: "#222222",
            borderRadius: 4
        }}>
            <Toolbar />
            <TweakPane />
        </div>
    )
}

export default Editor
