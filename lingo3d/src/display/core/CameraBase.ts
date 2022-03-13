import { Camera, Group } from "three"
import { getCamera } from "../../states/useCamera"
import { container } from "../../engine/render/renderer"
import ObjectManager from "./ObjectManager"
import { deg2Rad, rad2Deg } from "@lincode/math"
import CameraMixin from "./mixins/CameraMixin"
import { applyMixins } from "@lincode/utils"
import SimpleObjectManager from "./SimpleObjectManager"
import Point3d from "../../api/Point3d"
import { scaleUp, scaleDown } from "../../engine/constants"
import { ray, vector3_, vector3, euler } from "../utils/reusables"
import store, { createEffect } from "@lincode/reactivity"
import pillShape from "../../physics/shapes/pillShape"
import ICameraBase, { MouseControlMode } from "../../interface/ICameraBase"
import { Cancellable } from "@lincode/promiselikes"
import isMobile from "../../api/utils/isMobile"

const PI_2 = Math.PI * 0.5

abstract class CameraBase<T extends Camera> extends ObjectManager<Group> implements ICameraBase {
    protected camera: T

    protected override _physicsShape = pillShape

    public constructor(camera: T) {
        super(new Group())
        this.camera = camera
        this.object3d.add(camera)
        this.initCamera()
    }

    protected override getRay() {
        return ray.set(this.camera.getWorldPosition(vector3_), this.camera.getWorldDirection(vector3))
    }

    public override append(object: SimpleObjectManager) {
        this.camera.add(object.outerObject3d)
    }

    public override get width() {
        return this.object3d.scale.x * scaleUp
    }
    public override set width(val: number) {
        const num = val * scaleDown
        this.object3d.scale.x = num
        this.camera.scale.x = 1 / num
    }

    public override get height() {
        return this.object3d.scale.y * scaleUp
    }
    public override set height(val: number) {
        const num = val * scaleDown
        this.object3d.scale.y = num
        this.camera.scale.y = 1 / num
    }

    public override get depth() {
        return this.object3d.scale.z * scaleUp
    }
    public override set depth(val: number) {
        const num = val * scaleDown
        this.object3d.scale.z = num
        this.camera.scale.z = 1 / num
    }

    public override lookAt(target: SimpleObjectManager | Point3d) {
        super.lookAt(target)
        this.rotationY += 180
    }

    public get mouseControl() {
        return !!this.camera.userData.mouseControl
    }
    public set mouseControl(val: boolean) {
        val ? this.enableMouseControl() : this.disableMouseControl()
    }

    private _minPolarAngle = 5 * deg2Rad
    private _maxPolarAngle = 175 * deg2Rad

    public get minPolarAngle() {
        return this._minPolarAngle * rad2Deg
    }
    public set minPolarAngle(val: number) {
        this._minPolarAngle = val * deg2Rad
    }

    public get maxPolarAngle() {
        return this._maxPolarAngle * rad2Deg
    }
    public set maxPolarAngle(val: number) {
        this._maxPolarAngle = val * deg2Rad
    }

    public gyrate(movementX: number, movementY: number, inner?: boolean) {
        const manager = inner ? this.object3d : this.outerObject3d

        euler.setFromQuaternion(manager.quaternion)

        euler.y -= movementX * 0.002
        euler.x -= movementY * 0.002

        euler.x = Math.max(PI_2 - this._maxPolarAngle, Math.min(PI_2 - this._minPolarAngle, euler.x))

        manager.quaternion.setFromEuler(euler)
        !inner && this.physicsUpdateRotation()
    }

    public mouseControlMode?: MouseControlMode

    private mouseControlHandle: Cancellable | undefined
    public disableMouseControl() {
        if (!this.camera.userData.mouseControl) return
        this.camera.userData.mouseControl = false

        this.mouseControlHandle?.cancel()
    }
    public enableMouseControl() {
        if (this.camera.userData.mouseControl) return
        this.camera.userData.mouseControl = true

        if (isMobile) {
            let xTouch = 0
            let yTouch = 0

            const onTouchStart = (e: TouchEvent) => {
                e.preventDefault()

                xTouch = e.targetTouches[0].clientX
                yTouch = e.targetTouches[0].clientY
            }

            const onTouchMove = (e: TouchEvent) => {
                const xTouchNew = e.targetTouches[0].clientX
                const yTouchNew = e.targetTouches[0].clientY
                const movementX = xTouchNew - xTouch
                const movementY = yTouchNew - yTouch
                xTouch = xTouchNew
                yTouch = yTouchNew
                if (this.mouseControlMode === "orbit") 
                    this.gyrate(movementX * 2, movementY * 2)
                else {
                    this.gyrate(movementX * 2, 0)
                    this.gyrate(0, movementY * 2, true)
                }
            }

            container.addEventListener("touchstart", onTouchStart)
            container.addEventListener("touchmove", onTouchMove)
            this.watch(this.mouseControlHandle = new Cancellable(() => {
                container.removeEventListener("touchstart", onTouchStart)
                container.removeEventListener("touchmove", onTouchMove)
            }))
        }
        else {
            const [setLocked, getLocked] = store(false)

            const handle = this.mouseControlHandle = this.watch(new Cancellable())

            handle.watch(createEffect(() => {
                if (!getLocked()) return
                
                const onMouseMove = ({ movementX, movementY }: MouseEvent) => {
                    if (this.mouseControlMode === "orbit")
                        this.gyrate(movementX, movementY)
                    else {
                        this.gyrate(movementX, 0)
                        this.gyrate(0, movementY, true)
                    }
                }
                document.addEventListener("mousemove", onMouseMove)

                return () => {
                    document.removeEventListener("mousemove", onMouseMove)
                }
            }, [getLocked]))

            const onClick = () => getCamera() === this.camera && container.requestPointerLock()
            container.addEventListener("click", onClick)
            
            const onPointerLockChange = () => setLocked(document.pointerLockElement === container)
            document.addEventListener("pointerlockchange", onPointerLockChange)

            handle.then(() => {
                container.removeEventListener("click", onClick)
                document.removeEventListener("pointerlockchange", onPointerLockChange)
                document.exitPointerLock()
                setLocked(false)
            })   
        }
    }
}
interface CameraBase<T extends Camera> extends ObjectManager<Group>, CameraMixin<T> {}
applyMixins(CameraBase, [CameraMixin])
export default CameraBase