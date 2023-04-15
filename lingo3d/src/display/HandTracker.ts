import createElement from "../utils/createElement"
import Cube from "./primitives/Cube"
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import { range } from "@lincode/utils"
import MeshAppendable from "../api/core/MeshAppendable"
import { onBeforeRender } from "../events/onBeforeRender"
import Model from "./Model"
import FoundManager from "./core/FoundManager"
import { LowPassFilter, mapRange } from "@lincode/math"

const model = new Model()
model.src = "hand.glb"
model.innerRotationY = 275
model.innerRotationZ = 90
model.scaleX = -1

const getDirection = (fromPoint: MeshAppendable, toPoint: MeshAppendable) =>
    toPoint.outerObject3d.position
        .clone()
        .sub(fromPoint.outerObject3d.position)
        .normalize()

;(async () => {
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
        cube.visible = false
        return cube
    })
    const alpha = 0.5
    const lowPassList = range(21).map(() => [
        new LowPassFilter(alpha),
        new LowPassFilter(alpha),
        new LowPassFilter(alpha)
    ])

    model.onLoad = () => {
        const thumb1 = model.find("Thumb1_18")!
        const thumb2 = model.find("Thumb2_17")!

        const index1 = model.find("Index1_16")!
        const index2 = model.find("Index2_15")!
        const index3 = model.find("Index3_14")!

        const middle1 = model.find("Middle1_13")!
        const middle2 = model.find("Middle2_12")!
        const middle3 = model.find("Middle3_11")!

        const ring1 = model.find("Ring1_10")!
        const ring2 = model.find("Ring2_9")!
        const ring3 = model.find("Ring3_8")!

        const pinky1 = model.find("Pinky1_7")!
        const pinky2 = model.find("Pinky2_6")!
        const pinky3 = model.find("Pinky3_5")!

        const setFinger = (
            fingerManager: FoundManager,
            fromIndex: number,
            toIndex: number
        ) =>
            fingerManager.setRotationFromDirection(
                getDirection(cubes[fromIndex], cubes[toIndex])
            )

        onBeforeRender(() => {
            let nowInMs = Date.now()
            const results = handLandmarker.detectForVideo(video, nowInMs)

            if (!results.landmarks.length) return

            let i = 0
            for (const landmark of results.worldLandmarks[0]) {
                const [lowpassX, lowpassY, lowpassZ] = lowPassList[i]
                landmark.x = lowpassX.next(landmark.x)
                landmark.y = lowpassY.next(landmark.y)
                landmark.z = lowpassZ.next(landmark.z)

                const cube = cubes[i++]
                cube.x = landmark.x * -1000
                cube.y = landmark.y * -1000
                cube.z = landmark.z * -1000
            }

            model.setRotationFromDirection(getDirection(cubes[0], cubes[9]))

            const yaw = getDirection(cubes[3], cubes[17])
            model.rotationY = mapRange(yaw.x, 1, -1, 0, -180) - 30

            setFinger(thumb1, 2, 3)
            setFinger(thumb2, 3, 4)

            setFinger(index1, 5, 6)
            setFinger(index2, 6, 7)
            setFinger(index3, 7, 8)

            setFinger(middle1, 9, 10)
            setFinger(middle2, 10, 11)
            setFinger(middle3, 11, 12)

            setFinger(ring1, 13, 14)
            setFinger(ring2, 14, 15)
            setFinger(ring3, 15, 16)

            setFinger(pinky1, 17, 18)
            setFinger(pinky2, 18, 19)
            setFinger(pinky3, 19, 20)
        })
    }
})()

export default class HandTracker extends MeshAppendable {
    public constructor() {
        super()
    }
}
