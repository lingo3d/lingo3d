import AppBar from "../component/bars/AppBar"
import useInitCSS from "../hooks/useInitCSS"
import WorldControls from "./WorldControls"
import useInitEditor from "../hooks/useInitEditor"
import useSyncState from "../hooks/useSyncState"
import SelectBox from "../component/SelectBox"
import { getCameraList } from "../../states/useCameraList"
import getDisplayName from "../utils/getDisplayName"
import { getManager } from "../../display/core/utils/getManager"
import { setEditorCamera } from "../../states/useEditorCamera"
import WorldToggles from "./WorldToggles"

const WorldBar = () => {
    useInitCSS()
    useInitEditor()

    const cameraList = useSyncState(getCameraList)

    return (
        <div
            className="lingo3d-ui lingo3d-bg-dark lingo3d-worldbar"
            style={{
                width: "100%",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
            }}
        >
            <AppBar style={{ gap: 4 }}>
                <SelectBox
                    width={100}
                    options={cameraList.map((cam) =>
                        getDisplayName(getManager(cam)!)
                    )}
                    onChange={(index) => setEditorCamera(cameraList[index])}
                />
                <div style={{ flexGrow: 1, minWidth: 4 }} />
                <WorldControls />
            </AppBar>
        </div>
    )
}
export default WorldBar
