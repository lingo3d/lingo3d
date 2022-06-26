import CameraBase from "."
import { container } from "../../../engine/renderLoop/renderSetup"
import { PerspectiveCamera } from "three"
import { getCameraPointerLock, setCameraPointerLock } from "../../../states/useCameraPointerLock"
import { mouseEvents } from "../../../api/mouse"
import { setPickingMode } from "../../../states/usePickingMode"
import { getCameraRendered } from "../../../states/useCameraRendered"

export default function (this: CameraBase<PerspectiveCamera>) {
    if (this.done) return

    this.createEffect(() => {
        if (this.mouseControlState.get() !== true || getCameraRendered() !== this.camera) return
        setPickingMode("camera")
        return () => {
            setPickingMode("mouse")
        }
    }, [this.mouseControlState.get, getCameraRendered])

    this.createEffect(() => {
        if (getCameraRendered() !== this.camera || !this.mouseControlState.get()) return

        if (getCameraPointerLock() === this.camera) {
            const handleMove = (e: MouseEvent) => this.gyrate(e.movementX, e.movementY)
            document.addEventListener("mousemove", handleMove)

            return () => {
                document.removeEventListener("mousemove", handleMove)
            }
        }

        let started = false
        let xOld: number | undefined
        let yOld: number | undefined
        
        const handle0 = mouseEvents.on("down", () => (started = true, [xOld, yOld] = [undefined, undefined]))
        const handle1 = mouseEvents.on("up", () => started = false)

        const handleMove = (e: PointerEvent) => {
            xOld === undefined && (xOld = e.clientX)
            yOld === undefined && (yOld = e.clientY)
            const [movementX, movementY] = [e.clientX - xOld, e.clientY - yOld]
            ;[xOld, yOld] = [e.clientX, e.clientY]
            started && this.gyrate(movementX / window.innerWidth * 3000, movementY / window.innerHeight * 3000)
        }
        container.addEventListener("pointermove", handleMove)

        return () => {
            handle0.cancel()
            handle1.cancel()
            container.removeEventListener("pointermove", handleMove)
            started = false
        }
    }, [this.mouseControlState.get, getCameraRendered, getCameraPointerLock])

    this.createEffect(() => {
        const camera = getCameraRendered()
        if (this.mouseControlState.get() !== true || camera !== this.camera) return

        const onClick = () => container.requestPointerLock?.()
        const onPointerLockChange = () => {
            if (document.pointerLockElement === container)
                setCameraPointerLock(camera)
            else
                setCameraPointerLock(undefined)
        }
        container.addEventListener("click", onClick)
        document.addEventListener("pointerlockchange", onPointerLockChange)

        return () => {
            container.removeEventListener("click", onClick)
            document.removeEventListener("pointerlockchange", onPointerLockChange)
            document.exitPointerLock()
            setCameraPointerLock(undefined)
        }
    }, [this.mouseControlState.get, getCameraRendered])
}