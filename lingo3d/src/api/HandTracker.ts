import { Disposable } from "@lincode/promiselikes"
import { range } from "@lincode/utils"
import Cube from "../display/primitives/Cube"
import { Hands } from "@mediapipe/hands"
import { Camera } from "@mediapipe/camera_utils"
import store, { createEffect, GetGlobalState, SetGlobalState } from "@lincode/reactivity"
import { distance, distance3d, LowPassFilter, mapRange, vertexAngle3d } from "@lincode/math"
import Sphere from "../display/primitives/Sphere"
import Point3d from "./Point3d"
import { settings } from ".."

interface Options {
    width?: number
    height?: number
    skipFrames?: number
    pinchThreshold?: number
    maxNumHands?: number
    modelComplexity?: 0 | 1
    minDetectionConfidence?: number
    minTrackingConfidence?: number
}

export default class HandTracker extends Disposable {
    public onReady?: () => void
    public onTrack?: (visible: boolean) => void

    private setVisualize: SetGlobalState<boolean>
    private getVisualize: GetGlobalState<boolean>
        
    public get visualize() {
        return this.getVisualize()
    }
    public set visualize(val) {
        this.setVisualize(val)
    }

    public element = document.createElement("video")

    public thumb: Cube
    public thumbBase: Cube
    public thumbKnuckle: Cube
    public thumbCurlAngle = 0

    public index: Cube
    public indexBase: Cube
    public indexKnuckle: Cube
    public indexCurlAngle = 0

    public middle: Cube
    public middleBase: Cube
    public middleKnuckle: Cube
    public middleCurlAngle = 0

    public ring: Cube
    public ringBase: Cube
    public ringKnuckle: Cube
    public ringCurlAngle = 0

    public pinky: Cube
    public pinkyBase: Cube
    public pinkyKnuckle: Cube
    public pinkyCurlAngle = 0

    public center: Cube

    public pinch = false
    public pinchDist = 0

    public constructor({
        width = 320, height = 240,
        skipFrames = 0,
        pinchThreshold = 1.5,
        maxNumHands = 1,
        modelComplexity = 0,
        minDetectionConfidence = 0.9,
        minTrackingConfidence = 0.1

    }: Options = {}) {

        super()

        const [setReady, getReady] = store(false)
        const [setVisible, getVisible] = store(false)
        const [setVisualize, getVisualize] = store(false)
        this.setVisualize = setVisualize
        this.getVisualize = getVisualize
        
        const videoElement = this.element
        this.then(() => videoElement.remove())

        this.element.style.width = "100%"
        this.element.style.transform = "translateX(-50%) translateY(-50%)"
        this.element.style.left = "50%"
        this.element.style.top = "50%"
        this.element.style.position = "absolute"

        let frame = 0

        const camera = new Camera(videoElement, {
            width,
            height,
            onFrame: async () => {
                if (++frame >= skipFrames) {
                    frame = 0
                    return hands.send({ image: videoElement })
                }
            }
        })
        camera.start()

        const hands = new Hands({ locateFile: file => `${settings.wasmPath}${file}` })
        // const hands = new Hands()
        hands.setOptions({ maxNumHands, modelComplexity, minDetectionConfidence, minTrackingConfidence })

        const centerCube = new Sphere()
        centerCube.scale = 0.2
        centerCube.color = "yellow"

        const cubes = range(21).map(() => {
            const cube = new Cube()
            cube.scale = 0.05
            return cube
        })
        this.thumb = cubes[4]
        this.thumbKnuckle = cubes[3]
        this.thumbBase = cubes[2]
        this.thumbBase.color = "red"

        this.index = cubes[8]
        this.indexKnuckle = cubes[6]
        this.indexBase = cubes[5]
        this.indexBase.color = "red"

        this.middle = cubes[12]
        this.middleKnuckle = cubes[10]
        this.middleBase = cubes[9]
        this.middleBase.color = "red"

        this.ring = cubes[16]
        this.ringKnuckle = cubes[14]
        this.ringBase = cubes[13]
        this.ringBase.color = "red"
        
        this.pinky = cubes[20]
        this.pinkyKnuckle = cubes[18]
        this.pinkyBase = cubes[17]
        this.pinkyBase.color = "red"

        const center = this.center = cubes[9]

        const color = "yellow"
        this.thumb.color = color
        this.index.color = color
        this.middle.color = color
        this.ring.color = color
        this.pinky.color = color

        createEffect(() => {
            const visible = getVisualize() && getReady() && getVisible()
            for (const cube of cubes)
                cube.visible = visible

            centerCube.visible = visible

        }, [getVisualize, getReady, getVisible])

        getReady(ready => ready && this.onReady?.())

        const a = mapRange(skipFrames, 0, 4, 0.5, 1, true)
        const lowPassList = range(21).map(() => [new LowPassFilter(a), new LowPassFilter(a), new LowPassFilter(a)])
        let centerOld: Point3d | undefined

        hands.onResults(data => {
            setReady(true)

            const points = data.multiHandLandmarks[0]
            const worldPoints = data.multiHandWorldLandmarks[0]
            if (!points?.length || !worldPoints?.length) {
                centerOld = undefined
                getVisible() && this.onTrack?.(false)
                setVisible(false)
                return
            }
            setVisible(true)
            
            for (let i = 0; i <= 20; ++i) {
                const cube = cubes[i]
                const pt = points[i]
                const [lowpassX, lowpassY, lowpassZ] = lowPassList[i]
                cube.x = lowpassX.next((pt.x * 400 - 200))
                cube.y = lowpassY.next(-(pt.y * 400 - 200))
                cube.z = lowpassZ.next(-(pt.z * 400 - 200))
            }

            centerCube.x = center.x
            centerCube.y = center.y
            centerCube.z = center.z

            let releaseThreshold = pinchThreshold
            if (centerOld) {
                const speed = distance3d(center.x, center.y, center.z, centerOld.x, centerOld.y, centerOld.z)
                releaseThreshold = pinchThreshold + speed * 0.2
            }
            centerOld = new Point3d(center.x, center.y, center.z)
            
            const thumb = worldPoints[4]
            const index = worldPoints[8]
            this.pinchDist = distance(thumb.x, thumb.y, index.x, index.y) * 100

            if (this.pinch)
                this.pinchDist > releaseThreshold && (this.pinch = false)
            else if (this.pinchDist < pinchThreshold)
                this.pinch = true
            
            this.index.scale = this.pinch ? 0.2 : 0.05
            
            this.thumbCurlAngle = vertexAngle3d(this.thumbKnuckle, this.thumb, this.thumbBase)
            this.indexCurlAngle = vertexAngle3d(this.indexKnuckle, this.index, this.indexBase)
            this.middleCurlAngle = vertexAngle3d(this.middleKnuckle, this.middle, this.middleBase)
            this.ringCurlAngle = vertexAngle3d(this.ringKnuckle, this.ring, this.ringBase)
            this.pinkyCurlAngle = vertexAngle3d(this.pinkyKnuckle, this.pinky, this.pinkyBase)
            
            this.onTrack?.(true)
        })
    }
}