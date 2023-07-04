import createElement from "../utils/createElement"
import { lazy, range } from "@lincode/utils"
import Model from "./Model"
import FoundManager from "./core/FoundManager"
import { LowPassFilter, mapRange } from "@lincode/math"
import { vector3 } from "./utils/reusables"
import { event } from "@lincode/events"
import type { GestureRecognizerResult } from "@mediapipe/tasks-vision"
import { Cancellable } from "@lincode/promiselikes"
import Point3d from "../math/Point3d"
import { Point3dType } from "../typeGuards/isPoint"
import { Reactive } from "@lincode/reactivity"

const getDirection = (fromPoint: Point3dType, toPoint: Point3dType) =>
    vector3
        .copy(toPoint as any)
        .sub(fromPoint as any)
        .normalize()

const loadHandLandmarker = lazy(async () => {
    const { GestureRecognizer, FilesetResolver } = await import(
        "@mediapipe/tasks-vision"
    )
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    )
    const gestureRecognizer = await GestureRecognizer.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
            },
            runningMode: "VIDEO",
            numHands: 1
        }
    )
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
    const [emitDetect, onDetect] = event<GestureRecognizerResult>()

    setInterval(() => {
        const results = gestureRecognizer.recognizeForVideo(video, Date.now())
        if (!results.landmarks.length) return
        emitDetect(results)
    }, 34)
    return onDetect
})

export default class HandTracker extends Model {
    public thumb1?: FoundManager
    public thumb2?: FoundManager

    public index1?: FoundManager
    public index2?: FoundManager
    public index3?: FoundManager

    public middle1?: FoundManager
    public middle2?: FoundManager
    public middle3?: FoundManager

    public ring1?: FoundManager
    public ring2?: FoundManager
    public ring3?: FoundManager

    public pinky1?: FoundManager
    public pinky2?: FoundManager
    public pinky3?: FoundManager

    private points = range(21).map(() => new Point3d(0, 0, 0))
    private lowPassFilters = range(21).map(() => [
        new LowPassFilter(0.5),
        new LowPassFilter(0.5),
        new LowPassFilter(0.5)
    ])

    private setFinger(
        fingerManager: FoundManager,
        fromIndex: number,
        toIndex: number
    ) {
        fingerManager.setRotationFromDirection(
            getDirection(this.points[fromIndex], this.points[toIndex])
        )
    }

    public constructor() {
        super()

        this.src = "hand.glb"
        this.innerRotationY = 275
        this.innerRotationZ = 90

        this.scaleX = -1

        this.$events.once("loaded", () => {
            this.thumb1 = this.find("Thumb1_18")
            this.thumb2 = this.find("Thumb2_17")

            this.index1 = this.find("Index1_16")
            this.index2 = this.find("Index2_15")
            this.index3 = this.find("Index3_14")

            this.middle1 = this.find("Middle1_13")
            this.middle2 = this.find("Middle2_12")
            this.middle3 = this.find("Middle3_11")

            this.ring1 = this.find("Ring1_10")
            this.ring2 = this.find("Ring2_9")
            this.ring3 = this.find("Ring3_8")

            this.pinky1 = this.find("Pinky1_7")
            this.pinky2 = this.find("Pinky2_6")
            this.pinky3 = this.find("Pinky3_5")
        })

        this.createEffect(() => {
            if (!this.trackState.get()) return

            const handle = new Cancellable()
            loadHandLandmarker().then((onDetect) => {
                handle.watch(
                    onDetect((results) => {
                        this.gesture = results.gestures[0][0].categoryName

                        let i = 0
                        for (const landmark of results.worldLandmarks[0]) {
                            const [lowpassX, lowpassY, lowpassZ] =
                                this.lowPassFilters[i]
                            landmark.x = lowpassX.next(landmark.x)
                            landmark.y = lowpassY.next(landmark.y)
                            landmark.z = lowpassZ.next(landmark.z)

                            const cube = this.points[i++]
                            cube.x = landmark.x * -1000
                            cube.y = landmark.y * -1000
                            cube.z = landmark.z * -1000
                        }

                        this.setRotationFromDirection(
                            getDirection(this.points[0], this.points[9])
                        )

                        const yaw = getDirection(
                            this.points[3],
                            this.points[17]
                        )
                        this.rotationY = mapRange(yaw.x, 1, -1, 0, -180) - 30

                        this.setFinger(this.thumb1!, 2, 3)
                        this.setFinger(this.thumb2!, 3, 4)

                        this.setFinger(this.index1!, 5, 6)
                        this.setFinger(this.index2!, 6, 7)
                        this.setFinger(this.index3!, 7, 8)

                        this.setFinger(this.middle1!, 9, 10)
                        this.setFinger(this.middle2!, 10, 11)
                        this.setFinger(this.middle3!, 11, 12)

                        this.setFinger(this.ring1!, 13, 14)
                        this.setFinger(this.ring2!, 14, 15)
                        this.setFinger(this.ring3!, 15, 16)

                        this.setFinger(this.pinky1!, 17, 18)
                        this.setFinger(this.pinky2!, 18, 19)
                        this.setFinger(this.pinky3!, 19, 20)
                    })
                )
            })
            return () => {
                handle.cancel()
            }
        }, [this.trackState.get])
    }

    public gesture = ""

    private trackState = new Reactive(false)
    public get track() {
        return this.trackState.get()
    }
    public set track(value) {
        this.trackState.set(value)
    }
}
