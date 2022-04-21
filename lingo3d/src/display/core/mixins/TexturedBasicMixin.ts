import { Color, MeshBasicMaterial, MeshStandardMaterial, Object3D, RepeatWrapping, SpriteMaterial, Texture, Vector2, VideoTexture } from "three"
import loadTexture from "../../utils/loaders/loadTexture"
import ITexturedBasic from "../../../interface/ITexturedBasic"
import { objectURLMapperPtr } from "../../utils/loaders/setObjectURLMapper"
import { Reactive } from "@lincode/reactivity"

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

    private videoTextureState?: Reactive<string | undefined>
    private textureState?: Reactive<string | Array<string> | undefined>

    private updateMaterial() {
        this.material.needsUpdate = true
        this.applyTextureRepeat(this.material.map)
    }

    private initTexture() {
        if (this.textureState) return
        
        const videoTextureState = this.videoTextureState ??= new Reactive<string | undefined>(undefined)
        const textureState = this.textureState ??= new Reactive<string | Array<string> | undefined>(undefined)

        //@ts-ignore
        this.createEffect(() => {
            const url = textureState.get()
            let videoURL = videoTextureState.get()

            if (!videoURL && typeof url === "string" && objectURLMapperPtr[0](url).endsWith(".mp4"))
                videoURL = url

            if (videoURL) {
                const video = document.createElement("video")
                video.src = videoURL
                video.loop = true
                video.autoplay = true
                video.muted = true
                video.playsInline = true
                video.play()
                const videoTexture = new VideoTexture(video)
                videoTexture.wrapS = videoTexture.wrapT = RepeatWrapping

                const { map } = this.material
                this.material.map = videoTexture
                this.updateMaterial()

                return () => {
                    videoTexture.dispose()
                    video.pause()
                    this.material.map = map
                    this.updateMaterial()
                }
            }

            if (!url) return

            if (Array.isArray(url)) {
                const materials = url.map(src => new MeshBasicMaterial({ map: loadTexture(src) }))
                //@ts-ignore
                const { material } = this.object3d
                //@ts-ignore
                this.object3d.material = materials
                this.updateMaterial()

                return () => {
                    for (const material of materials)
                        material.dispose()

                    //@ts-ignore
                    this.object3d.material = material
                    this.updateMaterial()
                }
            }

            const { map } = this.material
            this.material.map = loadTexture(url)
            this.updateMaterial()

            return () => {
                this.material.map = map
                this.updateMaterial()
            }
        }, [videoTextureState.get, textureState.get])
    }

    public get videoTexture() {
        return this.videoTextureState?.get()
    }
    public set videoTexture(url: string | undefined) {
        this.initTexture()
        this.videoTextureState!.set(url)
    }

    public get texture() {
        return this.textureState?.get()
    }
    public set texture(url: string | Array<string> | undefined) {
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