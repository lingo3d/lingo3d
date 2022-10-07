import { deg2Rad } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import {
    MeshStandardMaterial,
    SpriteMaterial,
    Color,
    VideoTexture,
    RepeatWrapping,
    Vector2,
    Texture
} from "three"
import { appendableRoot } from "../../api/core/Appendable"
import EventLoopItem from "../../api/core/EventLoopItem"
import ITexturedBasic from "../../interface/ITexturedBasic"
import queueDebounce from "../../utils/queueDebounce"
import loadTexture from "../utils/loaders/loadTexture"

const mapNames = ["map", "alphaMap"]
const queueTextureRepeat = queueDebounce()

export default class BasicMaterialManager<
        T extends MeshStandardMaterial | SpriteMaterial
    >
    extends EventLoopItem
    implements ITexturedBasic
{
    public constructor(protected material: T) {
        super()
        appendableRoot.delete(this)
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.material.dispose()
        return this
    }

    public get color() {
        return "#" + this.material.color.getHexString()
    }
    public set color(val) {
        this.material.color = new Color(val)
    }

    private _opacity?: number
    public get opacity() {
        return (this._opacity ??= 1)
    }
    public set opacity(val) {
        this._opacity = val
        this.material.opacity = val
        this.material.transparent = val <= 1
    }

    protected applyTexture(mapNames: Array<string>) {
        queueTextureRepeat(this, () => {
            const repeat = this._textureRepeat
            const flipY = this._textureFlipY
            const rotation = this._textureRotation

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

        const videoTextureState = (this.videoTextureState = new Reactive<
            string | HTMLVideoElement | undefined
        >(undefined))
        const textureState = (this.textureState = new Reactive<
            string | undefined
        >(undefined))

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
