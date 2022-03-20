import CameraBase from "."
import isMobile from "../../../api/utils/isMobile"
import store, { createEffect } from "@lincode/reactivity"
import { getCamera } from "../../../states/useCamera"
import { container } from "../../../engine/render/renderer"
import { Camera } from "three"
import { Cancellable } from "@lincode/promiselikes"
import { setSelectionEnabled } from "../../../states/useSelectionEnabled"

export default function (this: CameraBase<Camera>, handle: Cancellable) {
    if (isMobile || this.mouseControl === "drag") {
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
            if (this.mouseControlMode === "orbit") 
                this.gyrate(movementX * 2, movementY * 2)
            else {
                this.gyrate(movementX * 2, 0)
                this.gyrate(0, movementY * 2, true)
            }

            if (Math.abs(xTouch - xTouchStart) > 10 || Math.abs(yTouch - yTouchStart) > 10)
                setSelectionEnabled(false)
        }

        const onTouchEnd = () => {
            started = false
            setSelectionEnabled(true)
        }

        if (this.mouseControl === "drag") {
            container.addEventListener("mousedown", onTouchStart)
            container.addEventListener("mousemove", onTouchMove)
            container.addEventListener("mouseup", onTouchEnd)
            document.addEventListener("mouseleave", onTouchEnd)
            handle.then(() => {
                container.removeEventListener("mousedown", onTouchStart)
                container.removeEventListener("mousemove", onTouchMove)
                container.removeEventListener("mouseup", onTouchEnd)
                document.removeEventListener("mouseleave", onTouchEnd)
                onTouchEnd()
            })
            return
        }
        container.addEventListener("touchstart", onTouchStart)
        container.addEventListener("touchmove", onTouchMove)
        container.addEventListener("touchend", onTouchEnd)
        container.addEventListener("touchcancel", onTouchEnd)
        handle.then(() => {
            container.removeEventListener("touchstart", onTouchStart)
            container.removeEventListener("touchmove", onTouchMove)
            container.removeEventListener("touchend", onTouchEnd)
            container.removeEventListener("touchcancel", onTouchEnd)
            onTouchEnd()
        })
        return
    }
    
    const [setLocked, getLocked] = store(false)

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