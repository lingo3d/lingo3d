import { getExtensionType } from "@lincode/filetypes"
import { deg2Rad, Point } from "@lincode/math"
import { Cancellable } from "@lincode/promiselikes"
import { filter, filterBoolean } from "@lincode/utils"
import { DoubleSide, Mesh, MeshStandardMaterial, Texture, Vector2 } from "three"
import ITexturedStandard, {
    texturedStandardSchema
} from "../../../interface/ITexturedStandard"
import debounceSystem from "../../../utils/debounceSystem"
import loadTexture from "../../utils/loaders/loadTexture"
import loadVideoTexture from "../../utils/loaders/loadVideoTexture"
import createReferenceCounter from "../utils/createReferenceCounter"

type Params = [
    color: string | undefined,
    opacity: number | undefined,
    texture: string | undefined,
    alphaMap: string | undefined,
    textureRepeat: number | Point | undefined,
    textureFlipY: boolean | undefined,
    textureRotation: number | undefined,
    wireframe: boolean | undefined,
    envMap: string | undefined,
    envMapIntensity: number | undefined,
    aoMap: string | undefined,
    aoMapIntensity: number | undefined,
    bumpMap: string | undefined,
    bumpScale: number | undefined,
    displacementMap: string | undefined,
    displacementScale: number | undefined,
    displacementBias: number | undefined,
    emissive: boolean | undefined,
    emissiveIntensity: number | undefined,
    lightMap: string | undefined,
    lightMapIntensity: number | undefined,
    metalnessMap: string | undefined,
    metalness: number | undefined,
    roughnessMap: string | undefined,
    roughness: number | undefined,
    normalMap: string | undefined,
    normalScale: number | undefined
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
            filter(
                {
                    side: DoubleSide,
                    color: params[0],
                    opacity: params[1],
                    transparent: params[1] !== undefined && params[1] < 1,
                    map: getMap(params[2], params[4], params[5], params[6]),
                    alphaMap: getMap(
                        params[3],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    wireframe: params[7],
                    envMap: getMap(params[8], params[4], params[5], params[6]),
                    envMapIntensity: params[9],
                    aoMap: getMap(params[10], params[4], params[5], params[6]),
                    aoMapIntensity: params[11],
                    bumpMap: getMap(
                        params[12],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    bumpScale: params[13],
                    displacementMap: getMap(
                        params[14],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    displacementScale: params[15],
                    displacementBias: params[16],
                    emissive: params[17] ? params[0] : undefined,
                    emissiveIntensity: params[18],
                    lightMap: getMap(
                        params[19],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    lightMapIntensity: params[20],
                    metalnessMap: getMap(
                        params[21],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    metalness: params[22],
                    roughnessMap: getMap(
                        params[23],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    roughness: params[24],
                    normalMap: getMap(
                        params[25],
                        params[4],
                        params[5],
                        params[6]
                    ),
                    normalScale: new Vector2(params[26], params[26])
                },
                filterBoolean
            )
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

const paramSize = Object.keys(texturedStandardSchema).length

export default abstract class TexturedStandardMixin
    implements ITexturedStandard
{
    public declare object3d: Mesh
    public declare then: (cb: (val: any) => void) => Cancellable

    public get material() {
        return this.object3d.material as MeshStandardMaterial
    }

    private _materialParams?: Params
    public get materialParams(): Params {
        return (this._materialParams ??= new Array(paramSize) as Params)
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
        return this.materialParams[1]
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
        return this.materialParams[7]
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

    public get envMapIntensity() {
        return this.materialParams[9]
    }
    public set envMapIntensity(val) {
        this.materialParams[9] = val
        refreshParamsSystem(this)
    }

    public get aoMap() {
        return this.materialParams[10]
    }
    public set aoMap(val) {
        this.materialParams[10] = val
        refreshParamsSystem(this)
    }

    public get aoMapIntensity() {
        return this.materialParams[11]
    }
    public set aoMapIntensity(val) {
        this.materialParams[11] = val
        refreshParamsSystem(this)
    }

    public get bumpMap() {
        return this.materialParams[12]
    }
    public set bumpMap(val) {
        this.materialParams[12] = val
        refreshParamsSystem(this)
    }

    public get bumpScale() {
        return this.materialParams[13]
    }
    public set bumpScale(val) {
        this.materialParams[13] = val
        refreshParamsSystem(this)
    }

    public get displacementMap() {
        return this.materialParams[14]
    }
    public set displacementMap(val) {
        this.materialParams[14] = val
        refreshParamsSystem(this)
    }

    public get displacementScale() {
        return this.materialParams[15]
    }
    public set displacementScale(val) {
        this.materialParams[15] = val
        refreshParamsSystem(this)
    }

    public get displacementBias() {
        return this.materialParams[16]
    }
    public set displacementBias(val) {
        this.materialParams[16] = val
        refreshParamsSystem(this)
    }

    public get emissive() {
        return this.materialParams[17]
    }
    public set emissive(val) {
        this.materialParams[17] = val
        refreshParamsSystem(this)
    }

    public get emissiveIntensity() {
        return this.materialParams[18]
    }
    public set emissiveIntensity(val) {
        this.materialParams[18] = val
        refreshParamsSystem(this)
    }

    public get lightMap() {
        return this.materialParams[19]
    }
    public set lightMap(val) {
        this.materialParams[19] = val
        refreshParamsSystem(this)
    }

    public get lightMapIntensity() {
        return this.materialParams[20]
    }
    public set lightMapIntensity(val) {
        this.materialParams[20] = val
        refreshParamsSystem(this)
    }

    public get metalnessMap() {
        return this.materialParams[21]
    }
    public set metalnessMap(val) {
        this.materialParams[21] = val
        refreshParamsSystem(this)
    }

    public get metalness() {
        return this.materialParams[22]
    }
    public set metalness(val) {
        this.materialParams[22] = val
        refreshParamsSystem(this)
    }

    public get roughnessMap() {
        return this.materialParams[23]
    }
    public set roughnessMap(val) {
        this.materialParams[23] = val
        refreshParamsSystem(this)
    }

    public get roughness() {
        return this.materialParams[24]
    }
    public set roughness(val) {
        this.materialParams[24] = val
        refreshParamsSystem(this)
    }

    public get normalMap() {
        return this.materialParams[25]
    }
    public set normalMap(val) {
        this.materialParams[25] = val
        refreshParamsSystem(this)
    }

    public get normalScale() {
        return this.materialParams[26]
    }
    public set normalScale(val) {
        this.materialParams[26] = val
        refreshParamsSystem(this)
    }
}
