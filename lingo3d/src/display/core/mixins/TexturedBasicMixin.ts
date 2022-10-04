import {
    Color,
    MeshStandardMaterial,
    RepeatWrapping,
    SpriteMaterial,
    Texture,
    Vector2,
    VideoTexture
} from "three"
import loadTexture from "../../utils/loaders/loadTexture"
import ITexturedBasic from "../../../interface/ITexturedBasic"
import { Reactive } from "@lincode/reactivity"
import queueDebounce from "../../../utils/queueDebounce"
import { deg2Rad } from "@lincode/math"

const mapNames = ["map", "alphaMap"]

const queueTextureRepeat = queueDebounce()

export default abstract class TexturedBasicMixin implements ITexturedBasic {
    protected abstract material: MeshStandardMaterial | SpriteMaterial

    protected materialCloned?: boolean
    protected tryCloneMaterial() {
        if (this.materialCloned) return
        this.materialCloned = true
        //@ts-ignore
        this.material = this.nativeObject3d.material = this.material.clone()
        //@ts-ignore
        this.then(() => this.material.dispose())
    }

    public get color() {
        return "#" + this.material.color.getHexString()
    }
    public set color(val) {
        this.tryCloneMaterial()
        this.material.color = new Color(val)
    }

    private _opacity?: number
    public get opacity() {
        return (this._opacity ??= 1)
    }
    public set opacity(val) {
        this.tryCloneMaterial()
        this._opacity = val
        this.material.opacity = val
        this.material.transparent = val <= 1
        //@ts-ignore
        this.nativeObject3d.visible = !!val
    }

    protected applyTexture(mapNames: Array<string>) {
        const repeat = this._textureRepeat
        const flipY = this._textureFlipY
        const rotation = this._textureRotation

        queueTextureRepeat(this, () => {
            this.tryCloneMaterial()
            for (const name of mapNames) {
                //@ts-ignore
                const map: Texture = this.material[name]
                if (!map) return
                repeat !== undefined && (map.repeat = repeat)
                flipY !== undefined && (map.flipY = flipY)
                rotation !== undefined && (map.rotation = rotation * deg2Rad)
                map.needsUpdate = true
            }
        })
    }

    private videoTextureState?: Reactive<string | HTMLVideoElement | undefined>
    private textureState?: Reactive<string | undefined>

    private initTexture() {
        if (this.textureState) return

        this.tryCloneMaterial()

        const videoTextureState = (this.videoTextureState = new Reactive<
            string | HTMLVideoElement | undefined
        >(undefined))
        const textureState = (this.textureState = new Reactive<
            string | undefined
        >(undefined))

        //@ts-ignore
        this.createEffect(() => {
            const url = textureState.get()
            const videoURL = videoTextureState.get()

            if (videoURL) {
                let video: HTMLVideoElement
                if (typeof videoURL === "string") {
                    video = document.createElement("video")
                    video.crossOrigin = "anonymous"
                    video.src = videoURL
                    video.loop = true
                    video.autoplay = true
                    video.muted = true
                    video.playsInline = true
                    video.play()
                } else video = videoURL

                const videoTexture = new VideoTexture(
                    video,
                    undefined,
                    RepeatWrapping,
                    RepeatWrapping
                )

                const { material } = this
                const { map } = material
                material.map = videoTexture
                material.needsUpdate = true
                this.applyTexture(mapNames)

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
            material.map = loadTexture(url)
            this.applyTexture(mapNames)

            return () => {
                material.map = map
                this.material.needsUpdate = true
            }
        }, [videoTextureState.get, textureState.get])
    }

    public get videoTexture() {
        return this.videoTextureState?.get()
    }
    public set videoTexture(url) {
        this.initTexture()
        this.videoTextureState!.set(url)
    }

    public get texture() {
        return this.textureState?.get()
    }
    public set texture(url) {
        this.initTexture()
        this.textureState!.set(url)
    }

    private _alphaMap?: string
    public get alphaMap() {
        return this._alphaMap
    }
    public set alphaMap(val) {
        this.tryCloneMaterial()
        this._alphaMap = val
        this.material.alphaMap = val ? loadTexture(val) : null
        this.applyTexture(mapNames)
    }

    protected _textureRepeat?: Vector2
    public get textureRepeat() {
        return this._textureRepeat
    }
    public set textureRepeat(val: Vector2 | number | undefined) {
        typeof val === "number" && (val = new Vector2(val, val))
        this._textureRepeat = val
        this.applyTexture(mapNames)
    }

    protected _textureFlipY?: boolean
    public get textureFlipY() {
        return this._textureFlipY
    }
    public set textureFlipY(val) {
        this._textureFlipY = val
        this.applyTexture(mapNames)
    }

    protected _textureRotation?: number
    public get textureRotation() {
        return this._textureRotation
    }
    public set textureRotation(val) {
        this._textureRotation = val
        this.applyTexture(mapNames)
    }
}
