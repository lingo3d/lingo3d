import AppBar from "../component/bars/AppBar"
import useInitCSS from "../hooks/useInitCSS"
import Controls from "./Controls"
import useInitEditor from "../hooks/useInitEditor"
import { useLayoutEffect } from "preact/hooks"
import { Pane } from "../TweakPane/tweakpane"
import useClickable from "../hooks/useClickable"
import { getManager } from "../../api/utils/manager"
import { getCameraComputed } from "../../states/useCameraComputed"
import { getCameraList } from "../../states/useCameraList"
import { setEditorCamera } from "../../states/useEditorCamera"
import { getSplitView, setSplitView } from "../../states/useSplitView"
import getComponentName from "../utils/getComponentName"
import { createEffect } from "@lincode/reactivity"

const Tabs = () => {
    useInitCSS()
    useInitEditor()

    const elRef = useClickable()

    useLayoutEffect(() => {
        const el = elRef.current
        if (!el) return

        const pane = new Pane({ container: el })
        const cameraFolder = pane.addFolder({ title: "camera" })

        const handle = createEffect(() => {
            const cameraList = getCameraList()
            const camera = getCameraComputed()
            const splitView = getSplitView()

            const cameraSettings = {
                get camera() {
                    return cameraList.indexOf(camera)
                },
                set camera(val) {
                    setEditorCamera(cameraList[val])
                },
                get split() {
                    return splitView
                },
                set split(val) {
                    setSplitView(val)
                }
            }

            const options: Record<string, number> = {}
            let i = 0
            for (const cam of cameraList)
                options[getComponentName(getManager(cam))] = i++

            const cameraInput = cameraFolder.add(
                pane.addInput(cameraSettings, "camera", { options })
            )
            const splitInput = cameraFolder.add(
                pane.addInput(cameraSettings, "split")
            )

            return () => {
                cameraInput.dispose()
                splitInput.dispose()
            }
        }, [pane, cameraFolder, getCameraList, getCameraComputed, getSplitView])

        return () => {
            handle.cancel()
        }
    }, [])

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-tabs"
            style={{ width: "100%" }}
        >
            <AppBar>
                <div ref={elRef} />
                <div style={{ flexGrow: 1, minWidth: 4 }} />
                <Controls />
            </AppBar>
        </div>
    )
}
export default Tabs
