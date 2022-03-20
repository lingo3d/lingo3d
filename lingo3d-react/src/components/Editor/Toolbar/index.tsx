import React, { useEffect, useState } from "react"
import GlobalIcon from "./icons/GlobalIcon"
import LocalIcon from "./icons/LocalIcon"
import ScreenSpaceIcon from "./icons/ScreenSpaceIcon"
import WorldSpaceIcon from "./icons/WorldSpaceIcon"
import { setTransformControlsMode } from "lingo3d/lib/states/useTransformControlsMode"
import { setTransformControlsSpace } from "lingo3d/lib/states/useTransformControlsSpace"
import { setOrbitControlsScreenSpacePanning } from "lingo3d/lib/states/useOrbitControlsScreenSpacePanning"
import IconButton from "./IconButton"
import TranslateIcon from "./icons/TranslateIcon"
import RotateIcon from "./icons/RotateIcon"
import ScaleIcon from "./icons/ScaleIcon"
import { useCamera, useCameraList } from "../hooks"

const Toolbar: React.VFC = () => {
    const [mode, setMode] = useState<"translate" | "rotate" | "scale">("translate")
    const [space, setSpace] = useState<"world" | "local">("local")
    const [screenSpacePanning, setScreenSpacePanning] = useState(false)
    const [camera] = useCamera()
    const [cameraList] = useCameraList()
    const isMainCamera = camera === cameraList[0]

    useEffect(() => {
        setTransformControlsMode(mode)
    }, [mode])

    useEffect(() => {
        setTransformControlsSpace(space)
    }, [space])

    useEffect(() => {
        setOrbitControlsScreenSpacePanning(screenSpacePanning)
    }, [screenSpacePanning])

    return (
        <div style={{ display: "flex", paddingTop: 10, paddingBottom: 10 }}>
            <div style={{ display: "flex", gap: 10, paddingLeft: 10, paddingRight: 10, borderRight: "1px solid #444444" }}>
                <IconButton onClick={() => setMode("translate")} active={mode === "translate"}>
                    <TranslateIcon />
                </IconButton>
                <IconButton onClick={() => setMode("rotate")} active={mode === "rotate"}>
                    <RotateIcon />
                </IconButton>
                <IconButton onClick={() => setMode("scale")} active={mode === "scale"}>
                    <ScaleIcon />
                </IconButton>
            </div>
            <div style={{ display: "flex", gap: 10, paddingLeft: 10, paddingRight: 10, borderRight: "1px solid #444444" }}>
                <IconButton onClick={() => setSpace("local")} active={mode !== "scale" && space === "local"}>
                    <LocalIcon />
                </IconButton>
                <IconButton onClick={() => setSpace("world")} active={mode !== "scale" && space === "world"}>
                    <GlobalIcon />
                </IconButton>
            </div>
            <div style={{ display: "flex", gap: 10, paddingLeft: 10, paddingRight: 10, borderRight: "1px solid #444444" }}>
                <IconButton onClick={() => setScreenSpacePanning(false)} active={isMainCamera && !screenSpacePanning}>
                    <WorldSpaceIcon />
                </IconButton>
                <IconButton onClick={() => setScreenSpacePanning(true)} active={isMainCamera && screenSpacePanning}>
                    <ScreenSpaceIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Toolbar