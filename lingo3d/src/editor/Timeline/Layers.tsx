import { LAYER_HEIGHT } from "../../globals"
import { useTimeline } from "./states"

const Layers = () => {
    const [timeline] = useTimeline()

    return (
        <div style={{ overflow: "scroll", width: 200 }}>
            <div style={{ height: LAYER_HEIGHT, background: "red" }}>hello</div>
            <div style={{ height: LAYER_HEIGHT, background: "red" }}>hello</div>
            <div style={{ height: LAYER_HEIGHT, background: "red" }}>hello</div>
            <div style={{ height: LAYER_HEIGHT, background: "red" }}>hello</div>
            <div style={{ height: LAYER_HEIGHT, background: "red" }}>hello</div>
            <div style={{ height: LAYER_HEIGHT, background: "red" }}>hello</div>
        </div>
    )
}

export default Layers
