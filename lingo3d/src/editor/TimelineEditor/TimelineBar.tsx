import AppBar from "../component/bars/AppBar"
import IconButton from "../component/IconButton"
import Button from "../component/Button"
import AudioIcon from "./icons/AudioIcon"

const TimelineBar = () => {
    return (
        <AppBar>
            <Button>
                <AudioIcon />
                Add audio
            </Button>
        </AppBar>
    )
}

export default TimelineBar
