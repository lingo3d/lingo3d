import { getExtensionType } from "@lincode/filetypes"
import { deg2Rad, Point } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { filter, filterBoolean } from "@lincode/utils"
import { DoubleSide, Mesh, MeshStandardMaterial, Texture, Vector2 } from "three"
import { texturedStandardDefaults } from "../../../interface/ITexturedStandard"
import getDefaultValue from "../../../interface/utils/getDefaultValue"
import debounceSystem from "../../../utils/debounceSystem"
import loadTexture from "../../utils/loaders/loadTexture"
import loadVideoTexture from "../../utils/loaders/loadVideoTexture"
import createReferenceCounter, {
    classMapsMap
} from "../utils/createReferenceCounter"

//color, opacity
type Params = [
    color: string | undefined,
    opacity: number | undefined,
    texture: string | undefined,
    alphaMap: string | undefined,
    textureRepeat: number | Point | undefined
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

const initMap = (
    map?: Texture | null,
    repeat?: number | Point,
    flipY?: boolean,
    rotation?: number
) => {
    if (!map) return
    if (repeat !== undefined)
        typeof repeat === "number"
            ? map.repeat.set(repeat, repeat)
            : map.repeat.set(repeat.x, repeat.y)
    if (rotation !== undefined) map.rotation = rotation * deg2Rad
    if (flipY !== undefined) map.flipY = flipY
    return map
}

const getMap = (texture?: string, textureRepeat?: number | Point) => {
    if (!texture) return

    if (texture[0] === "#" || texture[0] === ".")
        return initMap(loadVideoTexture(texture))

    const filetype = getExtensionType(texture)
    if (filetype === "image")
        return initMap(loadTexture(texture), textureRepeat)
    if (filetype === "video")
        return initMap(loadVideoTexture(texture), textureRepeat)
}

const [increaseCount, decreaseCount] = createReferenceCounter<
    MeshStandardMaterial,
    Params
>((_, params) => {
    const paramsObj: Record<string, any> = {}
    assignParamsObj(paramsObj, params[0], "color")
    assignParamsObj(paramsObj, params[1], "opacity")
    assignParamsObj(paramsObj, params[2], "texture")
    assignParamsObj(paramsObj, params[3], "alphaMap")
    assignParamsObj(paramsObj, params[4], "textureRepeat")

    return new MeshStandardMaterial(
        filter(
            {
                side: DoubleSide,
                color: params[0],
                opacity: params[1],
                map: getMap(params[2], params[4]),
                alphaMap: getMap(params[3], params[4])
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
        return (this._materialParams ??= new Array(27) as Params)
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

    private _alphaMap?: string
    public get alphaMap() {
        return this._alphaMap
    }
    public set alphaMap(val) {
        this.materialParams[3] = val
        refreshParamsSystem(this)
    }

    private _textureRepeat?: number | Point
    public get textureRepeat() {
        return this._textureRepeat
    }
    public set textureRepeat(val) {
        this.materialParams[4] = val
        refreshParamsSystem(this)
    }
}
