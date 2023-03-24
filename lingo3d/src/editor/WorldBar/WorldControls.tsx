import AppBarButton from "../component/AppBarButton"
import PlayIcon from "../component/icons/PlayIcon"
import PauseIcon from "../component/icons/PauseIcon"
import useSyncState from "../hooks/useSyncState"
import { getWorldPlay, setWorldPlay } from "../../states/useWorldPlay"

const WorldControls = () => {
    const play = useSyncState(getWorldPlay)

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex" }}>
                <AppBarButton
                    fill
                    disabled={play}
                    onClick={() => setWorldPlay(true)}
                >
                    <PlayIcon />
                </AppBarButton>
                <AppBarButton
                    fill
                    disabled={!play}
                    onClick={() => setWorldPlay(false)}
                >
                    <PauseIcon />
                </AppBarButton>
            </div>
        </div>
    )
}
export default WorldControls
