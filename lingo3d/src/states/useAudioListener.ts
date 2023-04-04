import store, { createEffect } from "@lincode/reactivity"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { getCameraRendered } from "./useCameraRendered"
import { AudioListener } from "three"

export const [setAudioListener, getAudioListener] = store<AudioListener | undefined>(
    undefined
)

createEffect(() => {
    const audioListener = getAudioListener()
    if (!audioListener) return

    const [cam] = cameraRenderedPtr
    cam.add(audioListener)

    return () => {
        cam.remove(audioListener)
    }
}, [getCameraRendered, getAudioListener])
