import {
    getDynamicResolution,
    setDynamicResolution
} from "../../states/useDynamicResolution"
import { getSplitView, setSplitView } from "../../states/useSplitView"
import { getStats, setStats } from "../../states/useStats"
import { getUILayer, setUILayer } from "../../states/useUILayer"
import {
    getWorldExpanded,
    setWorldExpanded
} from "../../states/useWorldExpanded"
import Switch from "../component/Switch"
import AppBar from "../component/bars/AppBar"
import useSyncState from "../hooks/useSyncState"

const WorldToggles = () => {
    const splitView = useSyncState(getSplitView)
    const uiLayer = useSyncState(getUILayer)
    const stats = useSyncState(getStats)
    const dynamicResolution = useSyncState(getDynamicResolution)
    const worldExpanded = useSyncState(getWorldExpanded)

    return (
        <AppBar
            className="lingo3d-ui lingo3d-bg-dark lingo3d-worldtoggles"
            style={{ gap: 4 }}
        >
            <Switch
                compact
                label="split"
                on={splitView}
                onChange={(val) => setSplitView(val)}
            />
            <Switch
                compact
                label="ui"
                on={uiLayer}
                onChange={(val) => setUILayer(val)}
            />
            <Switch
                compact
                label="stats"
                on={stats}
                onChange={(val) => {
                    setStats(val)
                    val && setUILayer(true)
                }}
            />
            <Switch
                compact
                label="perf"
                on={dynamicResolution}
                onChange={(val) => setDynamicResolution(val)}
            />
            <Switch
                compact
                label="expand"
                on={worldExpanded}
                onChange={(val) => setWorldExpanded(val)}
            />
        </AppBar>
    )
}

export default WorldToggles
