import { Color, MeshStandardMaterial, RepeatWrapping, SpriteMaterial, Vector2, VideoTexture } from "three"
import loadTexture from "../../utils/loaders/loadTexture"
import ITexturedBasic from "../../../interface/ITexturedBasic"
import { objectURLMapperPtr } from "../../utils/loaders/setObjectURLMapper"
import { Reactive } from "@lincode/reactivity"
import { debounce } from "@lincode/utils"

const mapNames = <const>["map", "alphaMap"]

const textureRepeatMap = new Map<TexturedBasicMixin, Vector2>()
const applyTextureRepeat = debounce(function(this: TexturedBasicMixin) {
    for (const [item, repeat] of textureRepeatMap) {
        for (const name of mapNames) {
            const map = item.material[name]
            map && (map.repeat = repeat)
        }
    }
    textureRepeatMap.clear()
}, 0, "trailing")

export default abstract class TexturedBasicMixin implements ITexturedBasic {
    protected abstract material: MeshStandardMaterial | SpriteMaterial
    protected abstract transparent?: boolean

    public get color() {
        return "#" + this.material.color.getHexString()
    }
    public set color(val: string) {
        this.material.color = new Color(val)
    }

    public get vertexColors() {
        return this.material.vertexColors
    }
    public set vertexColors(val: boolean) {
        this.material.vertexColors = val
    }

    public get fog() {
        return this.material.fog
    }
    public set fog(val: boolean) {
        this.material.fog = val
    }

    private _opacity?: number
    public get opacity() {
        return this._opacity ??= 1.0
    }
    public set opacity(val: number) {
        this._opacity = val
        this.material.opacity = val
        this.material.transparent = this.transparent ?? val < 1
        //@ts-ignore
        this.object3d.visible = !!val
    }

    private basicTextureRepeat() {
        this.material.needsUpdate = true
        
        if (!this._textureRepeat) return
        textureRepeatMap.set(this, this._textureRepeat)
        applyTextureRepeat()
    }

    private videoTextureState?: Reactive<string | HTMLVideoElement | undefined>
    private textureState?: Reactive<string | HTMLVideoElement | undefined>

    private initTexture() {
        if (this.textureState) return
        
        const videoTextureState = this.videoTextureState ??= new Reactive<string | HTMLVideoElement | undefined>(undefined)
        const textureState = this.textureState ??= new Reactive<string | HTMLVideoElement | undefined>(undefined)

        //@ts-ignore
        this.createEffect(() => {
            const url = textureState.get()
            let videoURL = videoTextureState.get()

            if (!videoURL && (
                (typeof url === "string" && objectURLMapperPtr[0](url).toLowerCase().endsWith(".mp4")) ||
                (url && url instanceof HTMLVideoElement)
            )) {
                videoURL = url
            }

            if (videoURL) {
                let video: HTMLVideoElement
                
                if (videoURL instanceof HTMLVideoElement)
                    video = videoURL
                else {
                    video = document.createElement("video")
                    video.crossOrigin = "anonymous"
                    video.src = videoURL
                    video.loop = true
                    video.autoplay = true
                    video.muted = true
                    video.playsInline = true
                    video.play()
                }
                
                const videoTexture = new VideoTexture(video)
                videoTexture.wrapS = videoTexture.wrapT = RepeatWrapping

                const { material } = this
                const { map } = material
                material.map = videoTexture
                material.needsUpdate = true
                this.basicTextureRepeat()

                return () => {
                    video.pause()
                    videoTexture.dispose()
                    material.map = map
                    material.needsUpdate = true
                }
            }

            if (!url) return

            const { material } = this
            const { map } = material
            material.map = loadTexture(url as string)
            this.basicTextureRepeat()

            return () => {
                material.map = map
                this.material.needsUpdate = true
            }
        }, [videoTextureState.get, textureState.get])
    }

    public get videoTexture() {
        return this.videoTextureState?.get()
    }
    public set videoTexture(url: string | HTMLVideoElement | undefined) {
        this.initTexture()
        this.videoTextureState!.set(url)
    }

    public get texture() {
        return this.textureState?.get()
    }
    public set texture(url: string | HTMLVideoElement | undefined) {
        this.initTexture()
        this.textureState!.set(url)
    }

    private _alphaMap?: string
    public get alphaMap() {
        return this._alphaMap
    }
    public set alphaMap(val: string | undefined) {
        this._alphaMap = val
        this.material.alphaMap = val ? loadTexture(val) : null
        this.basicTextureRepeat()
    }

    private _textureRepeat?: Vector2
    public get textureRepeat() {
        return this._textureRepeat
    }
    public set textureRepeat(val: Vector2 | number | undefined) {
        typeof val === "number" && (val = new Vector2(val, val))
        this._textureRepeat = val
        this.basicTextureRepeat()
    }
}