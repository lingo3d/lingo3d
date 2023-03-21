import { RepeatWrapping, Texture, VideoTexture } from "three"
import { forceGet } from "@lincode/utils"

const cache = new Map<string, VideoTexture>()

export const isSelector = (val: string) =>
    val[0] === "#" || (val[0] === "." && val[1] !== "/")

export default (url: string) =>
    forceGet(cache, url, () => {
        if (isSelector(url)) {
            const video = document.querySelector(url)
            if (video instanceof HTMLVideoElement)
                return new VideoTexture(
                    video,
                    undefined,
                    RepeatWrapping,
                    RepeatWrapping
                )
            return new Texture()
        }
        const video = document.createElement("video")
        video.crossOrigin = "anonymous"
        video.src = url
        video.loop = true
        video.autoplay = true
        video.muted = true
        video.playsInline = true
        video.play()
        return new VideoTexture(
            video,
            undefined,
            RepeatWrapping,
            RepeatWrapping
        )
    })
