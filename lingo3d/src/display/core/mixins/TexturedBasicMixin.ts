import { Color, MeshBasicMaterial, MeshStandardMaterial, SpriteMaterial, Texture, Vector2, VideoTexture } from "three"
import loadTexture from "../../utils/loaders/loadTexture"
import ITexturedBasic from "../../../interface/ITexturedBasic"
import { objectURLMapperPtr } from "../../utils/loaders/setObjectURLMapper"
import { Cancellable } from "@lincode/promiselikes"

const mapNames = <const>["map", "alphaMap"]

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

    private materialHandle?: Cancellable

    private _texture?: string | Array<string>
    public get texture() {
        return this._texture
    }
    public set texture(url: string | Array<string> | undefined) {
        this._texture = url

        this.materialHandle?.cancel()

        if (url) {
            if (Array.isArray(url)) {
                const materials = url.map(src => new MeshBasicMaterial({ map: loadTexture(src) }))
                //@ts-ignore
                this.object3d.material = materials
                this.materialHandle = new Cancellable(() => {
                    //@ts-ignore
                    this.object3d.material = this.material
                    for (const material of materials)
                        material.dispose()
                })
            }
            else if (objectURLMapperPtr[0](url).endsWith(".mp4")) {
                const video = document.createElement("video")
                video.src = url
                video.loop = true
                video.autoplay = true
                video.muted = true
                video.playsInline = true
                video.play()
                const videoTexture = new VideoTexture(video)
                this.material.map = videoTexture

                this.materialHandle = new Cancellable(() => {
                    videoTexture.dispose()
                    video.pause()
                })
            }
            else this.material.map = loadTexture(url)
        }
        else this.material.map = null

        this.material.needsUpdate = true
        this.applyTextureRepeat(this.material.map)
    }

    private _alphaMap?: string
    public get alphaMap() {
        return this._alphaMap
    }
    public set alphaMap(val: string | undefined) {
        this._alphaMap = val
        this.material.alphaMap = val ? loadTexture(val) : null
        this.applyTextureRepeat(this.material.alphaMap)
    }

    private applyTextureRepeat(map: Texture | null) {
        map && this._textureRepeat && (map.repeat = this._textureRepeat)
    }
    private _textureRepeat?: Vector2
    public get textureRepeat() {
        return this._textureRepeat
    }
    public set textureRepeat(val: Vector2 | number | undefined) {
        typeof val === "number" && (val = new Vector2(val, val))

        this._textureRepeat = val
        if (!val) return

        for (const name of mapNames)
            this.applyTextureRepeat(this.material[name])
    }
}