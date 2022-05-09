import CameraBase from "."
import { getCamera } from "../../../states/useCamera"
import { container } from "../../../engine/renderLoop/renderSetup"
import { PerspectiveCamera } from "three"
import { getPointerLockCamera, setPointerLockCamera } from "../../../states/usePointLockCamera"
import { mouseEvents } from "../../../api/mouse"
import { setPickingMode } from "../../../states/usePickingMode"

export default function (this: CameraBase<PerspectiveCamera>) {
    if (this.done) return

    this.createEffect(() => {
        if (this.mouseControlState.get() !== true || getCamera() !== this.camera) return
        setPickingMode("camera")
        return () => {
            setPickingMode("mouse")
        }
    }, [this.mouseControlState.get, getCamera])

    this.createEffect(() => {
        if (getCamera() !== this.camera || !this.mouseControlState.get()) return

        if (getPointerLockCamera() === this.camera) {
            const handleMove = (e: MouseEvent) => this.gyrate(e.movementX, e.movementY)
            document.addEventListener("mousemove", handleMove)

            return () => {
                document.removeEventListener("mousemove", handleMove)
            }
        }

        let started = false
        let [xOld, yOld] = [0, 0]
        
        const handle0 = mouseEvents.on("down", e => (started = true, [xOld, yOld] = [e.clientX, e.clientY]))
        const handle1 = mouseEvents.on("up", () => started = false)

        const handleMove = (e: PointerEvent) => {
            //hack for ios safari 14.7.1
            if (e.movementX === undefined) {
                const [movementX, movementY] = [e.clientX - xOld, e.clientY - yOld]
                ;[xOld, yOld] = [e.clientX, e.clientY]
                started && this.gyrate(movementX * 2, movementY * 2)
                return
            }
            started && this.gyrate(e.movementX * 2, e.movementY * 2)
        }
        container.addEventListener("pointermove", handleMove)

        return () => {
            handle0.cancel()
            handle1.cancel()
            container.removeEventListener("pointermove", handleMove)
            started = false
        }
    }, [this.mouseControlState.get, getCamera, getPointerLockCamera])

    this.createEffect(() => {
        const camera = getCamera()
        if (this.mouseControlState.get() !== true || camera !== this.camera) return

        const onClick = () => container.requestPointerLock?.()
        const onPointerLockChange = () => {
            if (document.pointerLockElement === container)
                setPointerLockCamera(camera)
            else
                setPointerLockCamera(undefined)
        }
        container.addEventListener("click", onClick)
        document.addEventListener("pointerlockchange", onPointerLockChange)

        return () => {
            container.removeEventListener("click", onClick)
            document.removeEventListener("pointerlockchange", onPointerLockChange)
            document.exitPointerLock()
            setPointerLockCamera(undefined)
        }
    }, [this.mouseControlState.get, getCamera])
}