import { RepeatWrapping, Texture, VideoTexture } from "three"
import { isSelector } from "../../../utils/isSelector"

export default (url: string) => {
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
    const texture = new VideoTexture(
        video,
        undefined,
        RepeatWrapping,
        RepeatWrapping
    )
    const { dispose } = texture
    texture.dispose = () => {
        dispose.call(texture)
        video.pause()
    }
}
