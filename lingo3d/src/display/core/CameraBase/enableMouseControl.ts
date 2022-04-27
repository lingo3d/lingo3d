import CameraBase from "."
import { getCamera } from "../../../states/useCamera"
import { container } from "../../../engine/renderLoop/renderSetup"
import { Camera } from "three"
import { setSelectionEnabled } from "../../../states/useSelectionEnabled"
import { getPointerLockCamera, setPointerLockCamera } from "../../../states/usePointLockCamera"
import { createEffect } from "@lincode/reactivity"
import { getMobile } from "../../../states/useMobile"

export default function (this: CameraBase<Camera>) {
    if (this.done) return

    this.createEffect(() => {
        const mobile = getMobile()
        const mouseControl = this.mouseControlState.get()

        if (mobile || mouseControl === "drag") {
            const camera = getCamera()
            if (camera !== this.camera) return

            setPointerLockCamera(camera)

            let xTouch = 0
            let yTouch = 0
            let xTouchStart = 0
            let yTouchStart = 0
            let started = false
    
            const onTouchStart = (e: TouchEvent | MouseEvent) => {
                e.preventDefault()
    
                started = true
                xTouchStart = xTouch = "targetTouches" in e ? e.targetTouches[0].clientX : e.clientX
                yTouchStart = yTouch = "targetTouches" in e ? e.targetTouches[0].clientY : e.clientY
            }
    
            const onTouchMove = (e: TouchEvent | MouseEvent) => {
                if (!started) return
    
                const xTouchNew = "targetTouches" in e ? e.targetTouches[0].clientX : e.clientX
                const yTouchNew = "targetTouches" in e ? e.targetTouches[0].clientY : e.clientY
                const movementX = xTouchNew - xTouch
                const movementY = yTouchNew - yTouch
                xTouch = xTouchNew
                yTouch = yTouchNew
    
                this.gyrate(movementX * 2, movementY * 2)
    
                if (Math.abs(xTouch - xTouchStart) > 10 || Math.abs(yTouch - yTouchStart) > 10)
                    setSelectionEnabled(false)
            }
    
            const onTouchEnd = () => {
                started = false
                setSelectionEnabled(true)
            }
    
            if (mouseControl === "drag" && !mobile) {
                container.addEventListener("mousedown", onTouchStart)
                container.addEventListener("mousemove", onTouchMove)
                container.addEventListener("mouseup", onTouchEnd)
                document.addEventListener("mouseleave", onTouchEnd)

                return () => {
                    setPointerLockCamera(undefined)
                    container.removeEventListener("mousedown", onTouchStart)
                    container.removeEventListener("mousemove", onTouchMove)
                    container.removeEventListener("mouseup", onTouchEnd)
                    document.removeEventListener("mouseleave", onTouchEnd)
                    onTouchEnd()
                }
            }

            container.addEventListener("touchstart", onTouchStart)
            container.addEventListener("touchmove", onTouchMove)
            container.addEventListener("touchend", onTouchEnd)
            container.addEventListener("touchcancel", onTouchEnd)

            return () => {
                setPointerLockCamera(undefined)
                container.removeEventListener("touchstart", onTouchStart)
                container.removeEventListener("touchmove", onTouchMove)
                container.removeEventListener("touchend", onTouchEnd)
                container.removeEventListener("touchcancel", onTouchEnd)
                onTouchEnd()
            }
        }
    
        createEffect(() => {
            if (getPointerLockCamera() !== this.camera) return
            
            const onMouseMove = ({ movementX, movementY }: MouseEvent) => {
                this.gyrate(movementX, movementY)
            }
            document.addEventListener("mousemove", onMouseMove)
    
            return () => {
                document.removeEventListener("mousemove", onMouseMove)
            }
        }, [getPointerLockCamera])
    
        createEffect(() => {
            const camera = getCamera()
            if (camera !== this.camera) return
    
            const onClick = () => container.requestPointerLock()
            container.addEventListener("click", onClick)
    
            const onPointerLockChange = () => {
                if (document.pointerLockElement === container)
                    setPointerLockCamera(camera)
                else
                    setPointerLockCamera(undefined)
            }
            document.addEventListener("pointerlockchange", onPointerLockChange)
    
            return () => {
                container.removeEventListener("click", onClick)
                document.removeEventListener("pointerlockchange", onPointerLockChange)
                document.exitPointerLock()
                setPointerLockCamera(undefined)
            }
        }, [getCamera])
        
    }, [getMobile, getCamera, getPointerLockCamera, this.mouseControlState.get])
}