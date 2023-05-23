import IconButton from "../component/IconButton"
import PlayIcon from "../component/icons/PlayIcon"
import PauseIcon from "../component/icons/PauseIcon"
import useSyncState from "../hooks/useSyncState"
import { getWorldPlay, setWorldPlay } from "../../states/useWorldPlay"
import { setEditorRuntime } from "../../states/useEditorRuntime"

const WorldControls = () => {
    const play = useSyncState(getWorldPlay)

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex" }}>
                <IconButton
                    fill
                    disabled={play}
                    onClick={() => {
                        setWorldPlay(true)
                        setEditorRuntime(true)
                    }}
                >
                    <PlayIcon />
                </IconButton>
                <IconButton
                    fill
                    disabled={!play}
                    onClick={() => {
                        setWorldPlay(false)
                        setEditorRuntime(false)
                    }}
                >
                    <PauseIcon />
                </IconButton>
            </div>
        </div>
    )
}
export default WorldControls
