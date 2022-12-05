import IconButton from "../component/IconButton"
import PlayIcon from "../component/icons/PlayIcon"
import PauseIcon from "../component/icons/PauseIcon"

const Controls = () => {
    return (
        <>
            <IconButton fill>
                <PlayIcon />
            </IconButton>
            <IconButton fill disabled>
                <PauseIcon />
            </IconButton>
        </>
    )
}
export default Controls
