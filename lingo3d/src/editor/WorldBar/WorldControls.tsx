import IconButton from "../component/IconButton"
import PlayIcon from "../component/icons/PlayIcon"
import PauseIcon from "../component/icons/PauseIcon"
import useSyncState from "../hooks/useSyncState"
import { getWorldMode, setWorldMode } from "../../states/useWorldMode"
import GamepadIcon from "./icons/GamepadIcon"

const WorldControls = () => {
    const worldPlay = useSyncState(getWorldMode)

    return (
        <div style={{ display: "flex", gap: 4 }}>
            <IconButton
                fill
                disabled={worldPlay !== "editor"}
                onClick={() => setWorldMode("runtime")}
            >
                <GamepadIcon />
            </IconButton>
            <IconButton
                fill
                disabled={worldPlay !== "editor"}
                onClick={() => setWorldMode("default")}
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
    )
}
export default WorldControls
