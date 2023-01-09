import { getExtensionType } from "@lincode/filetypes"
import { Cancellable } from "@lincode/promiselikes"
import { filter, filterBoolean } from "@lincode/utils"
import {
    DoubleSide,
    Mesh,
    MeshStandardMaterial,
    RepeatWrapping,
    Texture,
    VideoTexture
} from "three"
import { texturedStandardDefaults } from "../../../interface/ITexturedStandard"
import getDefaultValue from "../../../interface/utils/getDefaultValue"
import debounceSystem from "../../../utils/debounceSystem"
import loadTexture from "../../utils/loaders/loadTexture"
import createReferenceCounter, {
    classMapsMap
} from "../utils/createReferenceCounter"

//color, opacity
type Params = [
    color: string | undefined,
    opacity: number | undefined,
    texture: string | undefined
]

const assignParamsObj = (
    paramsObj: Record<string, any>,
    param: any,
    prop: keyof typeof texturedStandardDefaults
) => {
    if (
        param !== undefined &&
        param !== getDefaultValue(texturedStandardDefaults, prop, true)
    )
        paramsObj[prop] = param
}

const getMap = (params2?: string) => {
    if (!params2) return

    if (params2[0] === "#" || params2[0] === ".") {
        const video = document.querySelector(params2)
        if (video instanceof HTMLVideoElement)
            return new VideoTexture(
                video,
                undefined,
                RepeatWrapping,
                RepeatWrapping
            )
        return
    }
    const filetype = getExtensionType(params2)
    if (filetype === "image") return loadTexture(params2)
    if (filetype === "video") {
        const video = document.createElement("video")
        video.crossOrigin = "anonymous"
        video.src = params2
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
    }
}

const [increaseCount, decreaseCount] = createReferenceCounter<
    MeshStandardMaterial,
    Params
>((_, params) => {
    const paramsObj: Record<string, any> = {}
    assignParamsObj(paramsObj, params[0], "color")
    assignParamsObj(paramsObj, params[1], "opacity")
    assignParamsObj(paramsObj, params[2], "texture")

    return new MeshStandardMaterial(
        filter(
            {
                side: DoubleSide,
                color: params[0],
                opacity: params[1],
                map: getMap(params[2])
            },
            filterBoolean
        )
    )
})

export const refreshParamsSystem = debounceSystem(
    (target: TexturedStandardMixin) => {
        if (target.materialParamsOld)
            decreaseCount(MeshStandardMaterial, target.materialParamsOld)
        else
            target.then(() =>
                decreaseCount(MeshStandardMaterial, target.materialParams)
            )
        target.object3d.material = increaseCount(
            MeshStandardMaterial,
            target.materialParams
        )
        target.materialParamsOld = [...target.materialParams]
    }
)

// setInterval(() => {
//     console.log(classMapsMap.get(MeshStandardMaterial)![0])
// }, 1000)

export default abstract class TexturedStandardMixin {
    public declare object3d: Mesh
    public declare then: (cb: (val: any) => void) => Cancellable

    public get material() {
        return this.object3d.material as MeshStandardMaterial
    }

    private _materialParams?: Params
    public get materialParams(): Params {
        return (this._materialParams ??= new Array(4) as Params)
    }
    public materialParamsOld?: Params

    public get color() {
        return "#" + this.material.color.getHexString()
    }
    public set color(val) {
        this.materialParams[0] = val
        refreshParamsSystem(this)
    }

    public get opacity() {
        return this.material.opacity
    }
    public set opacity(val) {
        this.materialParams[1] = val
        refreshParamsSystem(this)
    }

    private _texture?: string
    public get texture() {
        return this._texture
    }
    public set texture(val) {
        this.materialParams[2] = val
        refreshParamsSystem(this)
    }
}
