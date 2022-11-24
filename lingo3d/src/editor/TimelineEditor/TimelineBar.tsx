import AppBar from "../component/bars/AppBar"
import Button from "../component/Button"
import AudioIcon from "./icons/AudioIcon"

const TimelineBar = () => {
    return (
        <AppBar>
            <Button>
                <AudioIcon />
                Add timeline audio
            </Button>
        </AppBar>
    )
}

export default TimelineBar
