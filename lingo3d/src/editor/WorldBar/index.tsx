import AppBar from "../component/bars/AppBar"
import useInitCSS from "../hooks/useInitCSS"
import WorldControls from "./WorldControls"
import useInitEditor from "../hooks/useInitEditor"
import { useLayoutEffect, useRef } from "preact/hooks"
import { getManager } from "../../display/core/utils/getManager"
import { getCameraComputed } from "../../states/useCameraComputed"
import { getCameraList } from "../../states/useCameraList"
import { setEditorCamera } from "../../states/useEditorCamera"
import getDisplayName from "../utils/getDisplayName"
import { createEffect } from "@lincode/reactivity"
import Switch from "../component/Switch"
import useSyncState from "../hooks/useSyncState"
import { getSplitView, setSplitView } from "../../states/useSplitView"
import usePane from "../Editor/usePane"
import mergeRefs from "../hooks/mergeRefs"
import { getUILayer, setUILayer } from "../../states/useUILayer"
import { stopPropagation } from "../utils/stopPropagation"
import {
    getWorldExpanded,
    setWorldExpanded
} from "../../states/useWorldExpanded"

const Tabs = () => {
    useInitCSS()
    useInitEditor()

    const splitView = useSyncState(getSplitView)
    const uiLayer = useSyncState(getUILayer)
    const worldExpanded = useSyncState(getWorldExpanded)
    const elRef = useRef<HTMLDivElement>(null)
    const [pane, setContainer] = usePane()

    useLayoutEffect(() => {
        const el = elRef.current
        if (!pane || !el) return

        const handle = createEffect(() => {
            const cameraList = getCameraList()
            const camera = getCameraComputed()

            const label = ""

            const cameraSettings = {
                get [label]() {
                    return cameraList.indexOf(camera)
                },
                set [label](val) {
                    setEditorCamera(cameraList[val])
                }
            }
            const options: Record<string, number> = {}
            let i = 0
            for (const cam of cameraList)
                options[getDisplayName(getManager(cam)!)] = i++

            const cameraInput = pane.addInput(cameraSettings, label, {
                options
            })
            el.querySelector<HTMLDivElement>(".tp-lblv_v")!.style.width =
                "100px"

            return () => {
                cameraInput.dispose()
            }
        }, [getCameraList, getCameraComputed])

        return () => {
            handle.cancel()
        }
    }, [pane])

    return (
        <div
            className="lingo3d-ui lingo3d-bg-dark lingo3d-tabs"
            style={{
                width: "100%",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
            }}
        >
            <AppBar style={{ gap: 4 }}>
                <div
                    ref={mergeRefs(elRef, setContainer, stopPropagation)}
                    style={{ marginLeft: -20 }}
                />
                <Switch
                    label="split"
                    on={splitView}
                    onChange={(val) => setSplitView(val)}
                />
                <Switch
                    label="ui"
                    on={uiLayer}
                    onChange={(val) => setUILayer(val)}
                />
                {/* <Switch
                    label="expand"
                    on={worldExpanded}
                    onChange={(val) => setWorldExpanded(val)}
                /> */}
                <div style={{ flexGrow: 1, minWidth: 4 }} />
                <WorldControls />
            </AppBar>
        </div>
    )
}
export default Tabs
