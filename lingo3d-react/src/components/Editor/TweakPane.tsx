import React, { useLayoutEffect, useRef } from "react"
import { settings } from "lingo3d"
import { setSelection } from "lingo3d/lib/states/useSelection"
import useObjectPanel from "./useObjectPanel"
import useWorldPanel from "./useWorldPanel"
import { useSelectionTarget, useCamera, useCameraList } from "./hooks"

const TweakPane: React.FC = () => {
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
        <div ref={divRef} style={{ width: 350, overflowY: "scroll" }} />
    )
}

export default TweakPane
