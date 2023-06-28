import IconButton from "../component/IconButton"
import PlayIcon from "../component/icons/PlayIcon"
import PauseIcon from "../component/icons/PauseIcon"
import useSyncState from "../hooks/useSyncState"
import { getWorldMode, setWorldMode } from "../../states/useWorldMode"
import { USE_RUNTIME } from "../../globals"

const WorldControls = () => {
    const worldPlay = useSyncState(getWorldMode)

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex" }}>
                <IconButton
                    fill
                    disabled={worldPlay !== "editor"}
                    onClick={() =>
                        setWorldMode(USE_RUNTIME ? "runtime" : "default")
                    }
                >
                    <PlayIcon />
                </IconButton>
                <IconButton
                    fill
                    disabled={worldPlay === "editor"}
                    onClick={() => setWorldMode("editor")}
                >
                    <PauseIcon />
                </IconButton>
            </div>
        </div>
    )
}
export default WorldControls
