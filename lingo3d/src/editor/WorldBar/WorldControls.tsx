import IconButton from "../component/IconButton"
import PlayIcon from "../component/icons/PlayIcon"
import PauseIcon from "../component/icons/PauseIcon"
import useSyncState from "../hooks/useSyncState"
import { getWorldPlay, setWorldPlay } from "../../states/useWorldPlay"
import { USE_RUNTIME } from "../../globals"

const WorldControls = () => {
    const worldPlay = useSyncState(getWorldPlay)

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex" }}>
                <IconButton
                    fill
                    disabled={worldPlay !== "editor"}
                    onClick={() =>
                        setWorldPlay(USE_RUNTIME ? "runtime" : "live")
                    }
                >
                    <PlayIcon />
                </IconButton>
                <IconButton
                    fill
                    disabled={worldPlay === "editor"}
                    onClick={() => setWorldPlay("editor")}
                >
                    <PauseIcon />
                </IconButton>
            </div>
        </div>
    )
}
export default WorldControls
