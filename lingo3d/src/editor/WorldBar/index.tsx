import AppBar from "../component/bars/AppBar"
import useInitCSS from "../hooks/useInitCSS"
import WorldControls from "./WorldControls"
import useInitEditor from "../hooks/useInitEditor"
import Switch from "../component/Switch"
import useSyncState from "../hooks/useSyncState"
import { getSplitView, setSplitView } from "../../states/useSplitView"
import { getUILayer, setUILayer } from "../../states/useUILayer"
import { getWorldExpanded } from "../../states/useWorldExpanded"
import SelectBox from "../component/SelectBox"
import { getCameraList } from "../../states/useCameraList"
import getDisplayName from "../utils/getDisplayName"
import { getManager } from "../../display/core/utils/getManager"
import { setEditorCamera } from "../../states/useEditorCamera"

const Tabs = () => {
    useInitCSS()
    useInitEditor()

    const splitView = useSyncState(getSplitView)
    const uiLayer = useSyncState(getUILayer)
    const cameraList = useSyncState(getCameraList)
    const worldExpanded = useSyncState(getWorldExpanded)

    return (
        <div
            className="lingo3d-ui lingo3d-bg-dark lingo3d-tabs"
            style={{
                width: "100%",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
            }}
        >
            <AppBar style={{ gap: 4 }}>
                <SelectBox
                    options={cameraList.map((cam) =>
                        getDisplayName(getManager(cam)!)
                    )}
                    onChange={(index) => setEditorCamera(cameraList[index])}
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
