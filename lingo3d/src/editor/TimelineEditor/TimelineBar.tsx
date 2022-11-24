import AppBar from "../component/bars/AppBar"
import AppBarButton from "../component/bars/AppBarButton"
import Button from "../component/Button"
import Tab from "../component/tabs/Tab"
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
