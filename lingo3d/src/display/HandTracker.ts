import createElement from "../utils/createElement"
import Cube from "./primitives/Cube"
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import { range } from "@lincode/utils"
import MeshAppendable from "../api/core/MeshAppendable"
import { onBeforeRender } from "../events/onBeforeRender"
;import Model from "./Model"
(async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    )
    const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task`
        },
        runningMode: "VIDEO",
        numHands: 2
    })
    const video = createElement<HTMLVideoElement>(`
        <video style="background-color: black" autoplay></video>
    `)
    // uiContainer.appendChild(video)
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    })
    video.srcObject = stream

    await new Promise<void>((resolve) =>
        video.addEventListener("loadeddata", () => resolve())
    )

    const cubes = range(21).map(() => {
        const cube = new Cube()
        cube.scale = 0.05
        return cube
    })

    const model = new Model()
    model.src = "hand.glb"

    onBeforeRender(() => {
        let nowInMs = Date.now()
        const results = handLandmarker.detectForVideo(video, nowInMs)

        if (!results.landmarks.length) return

        let i = 0
        for (const landmark of results.worldLandmarks[0]) {
            const cube = cubes[i++]
            cube.x = landmark.x * -1000
            cube.y = landmark.y * -1000
            cube.z = landmark.z * -1000
        }
    })
})()

export default class HandTracker extends MeshAppendable {
    public constructor() {
        super()
    }
}
