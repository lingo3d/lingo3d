import IconButton from "../component/IconButton"
import PlayIcon from "../component/icons/PlayIcon"
import PauseIcon from "../component/icons/PauseIcon"
import useSyncState from "../hooks/useSyncState"
import { getEditorModeComputed } from "../../states/useEditorModeComputed"
import { setEditorMode } from "../../states/useEditorMode"

const Controls = () => {
    const mode = useSyncState(getEditorModeComputed)

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex" }}>
                <IconButton
                    fill
                    disabled={mode === "play"}
                    onClick={() => setEditorMode("play")}
                >
                    <PlayIcon />
                </IconButton>
                <IconButton
                    fill
                    disabled={mode !== "play"}
                    onClick={() => setEditorMode("translate")}
                >
                    <PauseIcon />
                </IconButton>
            </div>
        </div>
    )
}
export default Controls
