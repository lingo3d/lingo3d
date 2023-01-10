import { getExtensionType } from "@lincode/filetypes"
import { deg2Rad, Point } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { filter, filterBoolean } from "@lincode/utils"
import { DoubleSide, Mesh, MeshStandardMaterial, Texture } from "three"
import { timer } from "../../../engine/eventLoop"
import debounceSystem from "../../../utils/debounceSystem"
import loadTexture from "../../utils/loaders/loadTexture"
import loadVideoTexture from "../../utils/loaders/loadVideoTexture"
import createReferenceCounter, {
    classMapsMap
} from "../utils/createReferenceCounter"

type Params = [
    color: string | undefined,
    opacity: number | undefined,
    texture: string | undefined,
    alphaMap: string | undefined,
    textureRepeat: number | Point | undefined,
    textureFlipY: boolean | undefined,
    textureRotation: number | undefined,
    wireframe: boolean | undefined,
    envMap: string | undefined
]

const initMap = (
    map: Texture | null,
    textureRepeat: number | Point | undefined,
    textureFlipY: boolean | undefined,
    textureRotation: number | undefined
) => {
    if (!map) return

    if (textureRepeat !== undefined)
        typeof textureRepeat === "number"
            ? map.repeat.set(textureRepeat, textureRepeat)
            : map.repeat.set(textureRepeat.x, textureRepeat.y)
    if (textureFlipY !== undefined) {
        map.flipY = textureFlipY
        map.needsUpdate = true
    }
    if (textureRotation !== undefined) map.rotation = textureRotation * deg2Rad
    return map
}

const getMap = (
    texture: string | undefined,
    textureRepeat: number | Point | undefined,
    textureFlipY: boolean | undefined,
    textureRotation: number | undefined
) => {
    if (!texture) return

    if (texture[0] === "#" || texture[0] === ".")
        return initMap(
            loadVideoTexture(texture),
            textureRepeat,
            textureFlipY,
            textureRotation
        )

    const filetype = getExtensionType(texture)
    if (filetype === "image")
        return initMap(
            loadTexture(texture),
            textureRepeat,
            textureFlipY,
            textureRotation
        )
    if (filetype === "video")
        return initMap(
            loadVideoTexture(texture),
            textureRepeat,
            textureFlipY,
            textureRotation
        )
}

const [increaseCount, decreaseCount] = createReferenceCounter<
    MeshStandardMaterial,
    Params
>(
    (_, params) =>
        new MeshStandardMaterial(
            // filter(
            {
                side: DoubleSide,
                color: params[0],
                opacity: params[1],
                transparent: params[1] !== undefined && params[1] < 1,
                map: getMap(params[2], params[4], params[5], params[6]),
                alphaMap: getMap(params[3], params[4], params[5], params[6]),
                wireframe: params[7],
                envMap: getMap(params[8], params[4], params[5], params[6])
            }
            // filterBoolean
            // )
        )
)

export const refreshParamsSystem = debounceSystem(
    (target: TexturedStandardMixin) => {
        if (target.materialParamString)
            decreaseCount(MeshStandardMaterial, target.materialParamString)
        else
            target.then(() =>
                decreaseCount(MeshStandardMaterial, target.materialParamString!)
            )
        const paramString = JSON.stringify(target.materialParams)
        target.object3d.material = increaseCount(
            MeshStandardMaterial,
            target.materialParams,
            paramString
        )
        target.materialParamString = paramString
    }
)

// timer(
//     1000,
//     Infinity,
//     () => {
//         console.log(classMapsMap.get(MeshStandardMaterial)![0])
//     },
//     true
// )

export default abstract class TexturedStandardMixin {
    public declare object3d: Mesh
    public declare then: (cb: (val: any) => void) => Cancellable

    public get material() {
        return this.object3d.material as MeshStandardMaterial
    }

    private _materialParams?: Params
    public get materialParams(): Params {
        return (this._materialParams ??= [, , , , , , , , ,])
    }
    public materialParamString?: string

    public get color() {
        return "#" + this.material.color.getHexString()
    }
    public set color(val) {
        this.materialParams[0] = val
        refreshParamsSystem(this)
    }

    public get opacity() {
        return this.materialParams[1] ?? this.material.opacity
    }
    public set opacity(val) {
        this.materialParams[1] = val
        refreshParamsSystem(this)
    }

    public get texture() {
        return this.materialParams[2]
    }
    public set texture(val) {
        this.materialParams[2] = val
        refreshParamsSystem(this)
    }

    public get alphaMap() {
        return this.materialParams[3]
    }
    public set alphaMap(val) {
        this.materialParams[3] = val
        refreshParamsSystem(this)
    }

    public get textureRepeat() {
        return this.materialParams[4] ?? this.material.map?.repeat
    }
    public set textureRepeat(val) {
        this.materialParams[4] = val
        refreshParamsSystem(this)
    }

    public get textureFlipY() {
        return this.materialParams[5] ?? this.material.map?.flipY
    }
    public set textureFlipY(val) {
        this.materialParams[5] = val
        refreshParamsSystem(this)
    }

    public get textureRotation() {
        return this.materialParams[6] ?? this.material.map?.rotation
    }
    public set textureRotation(val) {
        this.materialParams[6] = val
        refreshParamsSystem(this)
    }

    public get wireframe() {
        return this.materialParams[7] ?? this.material.wireframe
    }
    public set wireframe(val) {
        this.materialParams[7] = val
        refreshParamsSystem(this)
    }

    public get envMap() {
        return this.materialParams[8]
    }
    public set envMap(val) {
        this.materialParams[8] = val
        refreshParamsSystem(this)
    }
}
