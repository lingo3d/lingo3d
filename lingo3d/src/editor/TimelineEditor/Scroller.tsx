import { FRAME_MAX, FRAME_WIDTH } from "../../globals"

const Scroller = () => {
    return (
        <div className="lingo3d-absfull" style={{ overflow: "scroll" }}>
            <div style={{ width: FRAME_MAX * FRAME_WIDTH, height: 9999 }} />
        </div>
    )
}

export default Scroller
