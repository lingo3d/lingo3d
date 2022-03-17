import React, { useLayoutEffect, useRef } from "react"
import { settings } from "lingo3d"
import { setSelection } from "lingo3d/lib/states/useSelection"
import { setSelectionTarget, getSelectionTarget } from "lingo3d/lib/states/useSelectionTarget"
import { setCameraList, getCameraList } from "lingo3d/lib/states/useCameraList"
import { setCamera, getCamera } from "lingo3d/lib/states/useCamera"
import { hook } from "@lincode/react-global-state"
import useObjectPanel from "./useObjectPanel"
import useWorldPanel from "./useWorldPanel"

const useSelectionTarget = hook(setSelectionTarget, getSelectionTarget)
const useCamera = hook(setCamera, getCamera)
const useCameraList = hook(setCameraList, getCameraList)

interface EditorProps {
    className?: string
    style?: React.CSSProperties
    position?: "absolute" | "relative" | "fixed"
}

const Editor: React.FC<EditorProps> = ({ className, style, position }) => {
    const divRef = useRef<HTMLDivElement>(null)
    const [target] = useSelectionTarget()
    const [cam] = useCamera()
    const [camList] = useCameraList()

    useObjectPanel(target, cam, camList, divRef, !!target)
    useWorldPanel(cam, camList, divRef, !target)

    useLayoutEffect(() => {
        setSelection(true)
        settings.defaultOrbitControls = true
        settings.gridHelper = true

        return () => {
            setSelection(false)
            settings.defaultOrbitControls = false
            settings.gridHelper = false
        }
    }, [])

    return (
        <div ref={divRef} className={className} style={{
            position: position ?? "fixed",
            left: 0,
            top: 0,
            width: 350,
            height: "100vh",
            userSelect: "none",
            overflowY: "scroll",
            boxSizing: "border-box",
            ...style
        }} />
    )
}

export default Editor
