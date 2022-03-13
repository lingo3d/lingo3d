import { deg2Rad, rad2Deg } from "@lincode/math"
import { createEffect } from "@lincode/reactivity"
import { applyMixins } from "@lincode/utils"
import { PerspectiveCamera } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { camFar, camNear, scaleDown, scaleUp } from "../../engine/constants"
import { container } from "../../engine/render/renderer"
import { getCamera } from "../../states/useCamera"
import { getCameraDistance } from "../../states/useCameraDistance"
import EventLoopItem from "../../api/core/EventLoopItem"
import CameraMixin from "../core/mixins/CameraMixin"
import IOrbitCamera from "../../interface/IOrbitCamera"
import { loop } from "../../engine/eventLoop"

class OrbitCamera extends EventLoopItem implements IOrbitCamera {
    protected camera = new PerspectiveCamera(75, 1, camNear, camFar)
    public outerObject3d = this.camera
    private controls = new OrbitControls(this.camera, container)

    public constructor() {
        super()
        this.initOuterObject3d()

        this.initCamera()

        this.camera.position.z = getCameraDistance()
        this.controls.update()

        this.watch(createEffect(() => {
            const enabled = this.controls.enabled = getCamera() === this.camera
            if (!enabled) return

            const handle = loop(() => this.controls.update())
            return () => {
                handle.cancel()
            }
        }, [getCamera]))

        this.controls.enablePan = false
        this.controls.enableZoom = false

        this.then(() => this.controls.dispose())
    }

    private _targetX?: number
    public get targetX() {
        return this._targetX ??= 0
    }
    public set targetX(val: number) {
        this._targetX = val
        this.controls.target.x = val * scaleDown
    }

    private _targetY?: number
    public get targetY() {
        return this._targetY ??= 0
    }
    public set targetY(val: number) {
        this._targetY = val
        this.controls.target.y = val * scaleDown
    }
    
    private _targetZ?: number
    public get targetZ() {
        return this._targetZ ??= 0
    }
    public set targetZ(val: number) {
        this._targetZ = val
        this.controls.target.z = val * scaleDown
    }

    public get x() {
        return this.camera.position.x * scaleUp
    }
    public set x(val: number) {
        this.camera.position.x = val * scaleDown
    }

    public get y() {
        return this.camera.position.y * scaleUp
    }
    public set y(val: number) {
        this.camera.position.y = val * scaleDown
    }

    public get z() {
        return this.camera.position.z * scaleUp
    }
    public set z(val: number) {
        this.camera.position.z = val * scaleDown
    }

    public get rotationX() {
        return this.camera.rotation.x * rad2Deg
    }

    public get rotationY() {
        return this.camera.rotation.y * rad2Deg
    }

    public get rotationZ() {
        return this.camera.rotation.z * rad2Deg
    }

    public get enableDamping() {
        return this.controls.enableDamping
    }
    public set enableDamping(val: boolean) {
        this.controls.enableDamping = val
    }

    public get enablePan() {
        return this.controls.enablePan
    }
    public set enablePan(val: boolean) {
        this.controls.enablePan = val
    }

    public get enableZoom() {
        return this.controls.enableZoom
    }
    public set enableZoom(val: boolean) {
        this.controls.enableZoom = val
    }

    public get autoRotate() {
        return this.controls.autoRotate
    }
    public set autoRotate(val: boolean) {
        this.controls.autoRotate = val
    }

    public get autoRotateSpeed() {
        return this.controls.autoRotateSpeed
    }
    public set autoRotateSpeed(val: number) {
        this.controls.autoRotateSpeed = val
    }

    public setRotationY(val: number, lock?: boolean) {
        this.controls.minAzimuthAngle = this.controls.maxAzimuthAngle = val * deg2Rad
        this.controls.update()

        if (lock) return

        queueMicrotask(() => {
            this.controls.minAzimuthAngle = -Infinity
            this.controls.maxAzimuthAngle = Infinity
        })
        
    }

    public setRotationX(val: number, lock?: boolean) {
        this.controls.minPolarAngle = this.controls.maxPolarAngle = (val + 90) * deg2Rad
        this.controls.update()

        if (lock) return

        queueMicrotask(() => {
            this.controls.minPolarAngle = -Infinity
            this.controls.maxPolarAngle = Infinity
        })
    }

    public setDistance(val: number, lock?: boolean) {
        this.controls.minDistance = this.controls.maxDistance = val * scaleDown
        this.controls.update()

        if (lock) {
            this.controls.enableZoom = false
            return
        }

        queueMicrotask(() => {
            this.controls.minDistance = -Infinity
            this.controls.maxDistance = Infinity
        })
    }
}
interface OrbitCamera extends EventLoopItem, CameraMixin<PerspectiveCamera> {}
applyMixins(OrbitCamera, [CameraMixin])
export default OrbitCamera