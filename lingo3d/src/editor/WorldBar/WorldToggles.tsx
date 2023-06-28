import { getSplitView, setSplitView } from "../../states/useSplitView"
import { getUILayer, setUILayer } from "../../states/useUILayer"
import {
    getWorldExpanded,
    setWorldExpanded
} from "../../states/useWorldExpanded"
import Switch from "../component/Switch"
import AppBar from "../component/bars/AppBar"
import useSyncState from "../hooks/useSyncState"

type Props = {
    topLevel?: boolean
}

const WorldToggles = ({ topLevel }: Props) => {
    const splitView = useSyncState(getSplitView)
    const uiLayer = useSyncState(getUILayer)
    const worldExpanded = useSyncState(getWorldExpanded)

    return (
        <AppBar
            className="lingo3d-ui lingo3d-bg-dark lingo3d-worldtoggles"
            style={{ gap: 4, width: topLevel ? "100%" : "auto" }}
        >
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
            <Switch
                label="expand"
                on={worldExpanded}
                onChange={(val) => setWorldExpanded(val)}
            />
        </AppBar>
    )
}

export default WorldToggles
