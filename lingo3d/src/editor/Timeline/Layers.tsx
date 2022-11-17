import { LAYER_HEIGHT } from "../../globals"
import { useTimeline } from "../states"

const Layers = () => {
    const [timeline] = useTimeline()

    return (
        <div style={{ overflow: "scroll", width: 200 }}>
            {timeline?.data &&
                Object.entries(timeline.data).map(([uuid, data]) => (
                    <div style={{ height: LAYER_HEIGHT, background: "red" }}>
                        {uuid}
                    </div>
                ))}
        </div>
    )
}

export default Layers
