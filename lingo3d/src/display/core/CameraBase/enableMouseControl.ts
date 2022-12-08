import CameraBase from "."
import { container } from "../../../engine/renderLoop/renderSetup"
import {
    getCameraPointerLock,
    setCameraPointerLock
} from "../../../states/useCameraPointerLock"
import { mouseEvents } from "../../../api/mouse"
import { getCameraRendered } from "../../../states/useCameraRendered"
import isMobile from "../../../api/utils/isMobile"
import { getEditorPlay } from "../../../states/useEditorPlay"

export default function (this: CameraBase) {
    if (this.done) return

    this.createEffect(() => {
        if (
            getCameraRendered() !== this.camera ||
            !this.mouseControlState.get()
        )
            return

        if (getCameraPointerLock() === this.camera) {
            const handleMove = (e: MouseEvent) =>
                this.gyrate(e.movementX, e.movementY)
            document.addEventListener("mousemove", handleMove)

            return () => {
                document.removeEventListener("mousemove", handleMove)
            }
        }

        let started = false
        let identifier: number | undefined
        let xOld: number | undefined
        let yOld: number | undefined

        const handleDown = () => {
            started = true
            ;[xOld, yOld] = [undefined, undefined]
        }
        const handleUp = () => (started = false)

        const handleMove = (e: MouseEvent | Touch) => {
            xOld === undefined && (xOld = e.clientX)
            yOld === undefined && (yOld = e.clientY)
            const [movementX, movementY] = [e.clientX - xOld, e.clientY - yOld]
            ;[xOld, yOld] = [e.clientX, e.clientY]
            started &&
                this.gyrate(
                    (movementX / window.innerWidth) * 3000,
                    (movementY / window.innerHeight) * 3000
                )
        }

        if (isMobile) {
            const handleTouchStart = (e: TouchEvent) => {
                if (identifier !== undefined) return
                identifier =
                    e.changedTouches[e.changedTouches.length - 1].identifier
                handleDown()
            }
            container.addEventListener("touchstart", handleTouchStart)

            const handleTouchEnd = (e: TouchEvent) => {
                if (identifier === undefined) return
                if (
                    e.changedTouches[e.changedTouches.length - 1].identifier ===
                    identifier
                ) {
                    identifier = undefined
                    handleUp()
                }
            }
            container.addEventListener("touchend", handleTouchEnd)

            const handleTouchMove = (e: TouchEvent) => {
                if (identifier === undefined) return
                let touch: Touch | undefined
                for (let i = 0; i < e.changedTouches.length; ++i) {
                    const t = e.changedTouches[i]
                    if (t.identifier === identifier) {
                        touch = t
                        break
                    }
                }
                touch && handleMove(touch)
            }
            container.addEventListener("touchmove", handleTouchMove)

            return () => {
                container.removeEventListener("touchstart", handleTouchStart)
                container.removeEventListener("touchend", handleTouchEnd)
                container.removeEventListener("touchmove", handleTouchMove)
                identifier = undefined
                started = false
            }
        }

        const handle0 = mouseEvents.on("down", handleDown)
        const handle1 = mouseEvents.on("up", handleUp)
        container.addEventListener("mousemove", handleMove)

        return () => {
            handle0.cancel()
            handle1.cancel()
            container.removeEventListener("mousemove", handleMove)
            identifier = undefined
            started = false
        }
    }, [this.mouseControlState.get, getCameraRendered, getCameraPointerLock])

    this.createEffect(() => {
        const camera = getCameraRendered()
        if (
            this.mouseControlState.get() !== true ||
            camera !== this.camera ||
            !getEditorPlay()
        )
            return

        const onClick = () => container.requestPointerLock?.()
        const onPointerLockChange = () => {
            if (document.pointerLockElement === container)
                setCameraPointerLock(camera)
            else setCameraPointerLock(undefined)
        }
        container.addEventListener("click", onClick)
        document.addEventListener("pointerlockchange", onPointerLockChange)

        return () => {
            container.removeEventListener("click", onClick)
            document.removeEventListener(
                "pointerlockchange",
                onPointerLockChange
            )
            document.exitPointerLock()
            setCameraPointerLock(undefined)
        }
    }, [this.mouseControlState.get, getCameraRendered, getEditorPlay])
}
