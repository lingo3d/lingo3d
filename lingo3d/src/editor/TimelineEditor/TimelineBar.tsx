import TimelineAudio from "../../display/TimelineAudio"
import AppBar from "../component/bars/AppBar"
import Button from "../component/Button"
import AudioIcon from "./icons/AudioIcon"

const TimelineBar = () => {
    return (
        <AppBar>
            <Button
                onClick={() => {
                    const audio = new TimelineAudio()
                }}
            >
                <AudioIcon />
                Add audio
            </Button>
        </AppBar>
    )
}

export default TimelineBar
