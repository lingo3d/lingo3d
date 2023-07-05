import IconButton from "../component/IconButton"
import RedoIcon from "./icons/RedoIcon"
import UndoIcon from "./icons/UndoIcon"

const CharacterRigControls = () => {
    return (
        <div
            ref={console.log}
            style={{
                display: "flex",
                gap: 4,
                position: "absolute",
                left: 0,
                top: 0,
                marginLeft: 8
            }}
        >
            <IconButton fill borderless>
                <UndoIcon />
            </IconButton>
            <IconButton fill borderless>
                <RedoIcon />
            </IconButton>
        </div>
    )
}

export default CharacterRigControls
