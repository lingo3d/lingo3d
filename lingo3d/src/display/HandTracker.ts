import createElement from "../utils/createElement"
import { lazy, range } from "@lincode/utils"
import Model from "./Model"
import FoundManager from "./core/FoundManager"
import { LowPassFilter, Point3d, mapRange } from "@lincode/math"
import { vector3 } from "./utils/reusables"
import { event } from "@lincode/events"
import { HandLandmarkerResult } from "@mediapipe/tasks-vision"

const getDirection = (fromPoint: Point3d, toPoint: Point3d) =>
    vector3
        .copy(toPoint as any)
        .sub(fromPoint as any)
        .normalize()

const loadHandLandmarker = lazy(async () => {
    const { HandLandmarker, FilesetResolver } = await import(
        "@mediapipe/tasks-vision"
    )
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

    const [emitDetect, onDetect] = event<HandLandmarkerResult>()

    setInterval(() => {
        const results = handLandmarker.detectForVideo(video, Date.now())
        if (!results.landmarks.length) return
        emitDetect(results)
    }, 34)
    return onDetect
})

export default class HandTracker extends Model {
    public constructor() {
        super()

        this.src = "hand.glb"
        this.innerRotationY = 275
        this.innerRotationZ = 90

        const points = range(21).map(() => new Point3d(0, 0, 0))
        const alpha = 0.5
        const lowPassList = range(21).map(() => [
            new LowPassFilter(alpha),
            new LowPassFilter(alpha),
            new LowPassFilter(alpha)
        ])

        this.scaleX = -1

        this.loaded.then(() => {
            const thumb1 = this.find("Thumb1_18")!
            const thumb2 = this.find("Thumb2_17")!

            const index1 = this.find("Index1_16")!
            const index2 = this.find("Index2_15")!
            const index3 = this.find("Index3_14")!

            const middle1 = this.find("Middle1_13")!
            const middle2 = this.find("Middle2_12")!
            const middle3 = this.find("Middle3_11")!

            const ring1 = this.find("Ring1_10")!
            const ring2 = this.find("Ring2_9")!
            const ring3 = this.find("Ring3_8")!

            const pinky1 = this.find("Pinky1_7")!
            const pinky2 = this.find("Pinky2_6")!
            const pinky3 = this.find("Pinky3_5")!

            const setFinger = (
                fingerManager: FoundManager,
                fromIndex: number,
                toIndex: number
            ) =>
                fingerManager.setRotationFromDirection(
                    getDirection(points[fromIndex], points[toIndex])
                )

            loadHandLandmarker().then((onDetect) => {
                onDetect((results) => {
                    let i = 0
                    for (const landmark of results.worldLandmarks[0]) {
                        const [lowpassX, lowpassY, lowpassZ] = lowPassList[i]
                        landmark.x = lowpassX.next(landmark.x)
                        landmark.y = lowpassY.next(landmark.y)
                        landmark.z = lowpassZ.next(landmark.z)

                        const cube = points[i++]
                        cube.x = landmark.x * -1000
                        cube.y = landmark.y * -1000
                        cube.z = landmark.z * -1000
                    }

                    this.setRotationFromDirection(
                        getDirection(points[0], points[9])
                    )

                    const yaw = getDirection(points[3], points[17])
                    this.rotationY = mapRange(yaw.x, 1, -1, 0, -180) - 30

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
            })
        })
    }
}
