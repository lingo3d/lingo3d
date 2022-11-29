import Cube from "../display/primitives/Cube"
import Timeline from "../display/Timeline"
import TimelineAudio from "../display/TimelineAudio"

const box = new Cube()

// box.animation = {
//     rotationX: [0, 180, 360],
//     x: [0, 100, 0]
// }

const audio = new TimelineAudio()
audio.src = "rave.wav"

const timeline = new Timeline()
timeline.data = {
    [box.uuid]: {
        x: {
            0: 0,
            60: 100,
            120: 0
        },
        rotationX: {
            0: 0,
            60: 180,
            80: 0
        }
    },
    // [audio.uuid]: {}
}
