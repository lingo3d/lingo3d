import Cube from "../display/primitives/Cube"
import Timeline from "../display/Timeline"

const box = new Cube()

const timeline = new Timeline()
timeline.setData({
    [box.uuid]: {
        x: [
            [0, 0],
            [1, 100],
            [2, 0]
        ]
    }
})
