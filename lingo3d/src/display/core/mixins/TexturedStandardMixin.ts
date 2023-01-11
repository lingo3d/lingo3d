import { Point } from "@lincode/math"
import { filter } from "@lincode/utils"
import { DoubleSide, MeshStandardMaterial, Vector2 } from "three"
import ITexturedStandard, {
    texturedStandardDefaults,
    texturedStandardSchema
} from "../../../interface/ITexturedStandard"
import getDefaultValue from "../../../interface/utils/getDefaultValue"
import debounceSystem from "../../../utils/debounceSystem"
import { color } from "../../utils/reusables"
import createReferenceCounter from "../utils/createReferenceCounter"
import filterNotDefault from "./utils/filterNotDefault"
import getMap from "./utils/getMap"

export type StandardParams = [
    color: string,
    opacity: number,
    texture: string,
    alphaMap: string,
    textureRepeat: number | Point,
    textureFlipY: boolean,
    textureRotation: number,
    wireframe: boolean,
    envMap: string,
    envMapIntensity: number,
    aoMap: string,
    aoMapIntensity: number,
    bumpMap: string,
    bumpScale: number,
    displacementMap: string,
    displacementScale: number,
    displacementBias: number,
    emissive: boolean,
    emissiveIntensity: number,
    lightMap: string,
    lightMapIntensity: number,
    metalnessMap: string,
    metalness: number,
    roughnessMap: string,
    roughness: number,
    normalMap: string,
    normalScale: number
]

const [increaseCount, decreaseCount, allocateDefaultInstance] =
    createReferenceCounter<MeshStandardMaterial, StandardParams>(
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
                        envMap: getMap(
                            params[8],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        envMapIntensity: params[9],
                        aoMap: getMap(
                            params[10],
                            params[4],
                            params[5],
                            params[6]
                        ),
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
                    filterNotDefault
                )
            )
    )

const refreshParamsSystem = debounceSystem((target: TexturedStandardMixin) => {
    if (target.materialParamString)
        decreaseCount(MeshStandardMaterial, target.materialParamString)
    else {
        //@ts-ignore
        target.then(() =>
            decreaseCount(MeshStandardMaterial, target.materialParamString!)
        )
    }
    const paramString = JSON.stringify(target.materialParams)
    target.material = increaseCount(
        MeshStandardMaterial,
        target.materialParams,
        paramString
    )
    target.materialParamString = paramString
})

export const standardDefaults = Object.fromEntries(
    Object.entries(texturedStandardSchema).map(([key]) => [
        key,
        structuredClone(getDefaultValue(texturedStandardDefaults, key, true))
    ])
)
export const standardDefaultParams = Object.values(
    standardDefaults
) as StandardParams

allocateDefaultInstance(MeshStandardMaterial, standardDefaultParams)

export default abstract class TexturedStandardMixin
    implements ITexturedStandard
{
    public get material() {
        //@ts-ignore
        return this.object3d.material
    }
    public set material(val: MeshStandardMaterial) {
        //@ts-ignore
        this.object3d.material = val
    }

    private _materialParams?: StandardParams
    public get materialParams() {
        return (this._materialParams ??= Object.values(
            standardDefaultParams
        ) as StandardParams)
    }
    public materialParamString?: string

    public get color() {
        return this.materialParams[0]
    }
    public set color(val: string | undefined) {
        this.materialParams[0] = val
            ? "#" + color.set(val).getHexString()
            : standardDefaults.color
        refreshParamsSystem(this)
    }

    public get opacity() {
        return this.materialParams[1]
    }
    public set opacity(val: number | undefined) {
        this.materialParams[1] = val ?? standardDefaults.opacity
        refreshParamsSystem(this)
    }

    public get texture() {
        return this.materialParams[2]
    }
    public set texture(val: string | undefined) {
        this.materialParams[2] = val ?? standardDefaults.texture
        refreshParamsSystem(this)
    }

    public get alphaMap() {
        return this.materialParams[3]
    }
    public set alphaMap(val: string | undefined) {
        this.materialParams[3] = val ?? standardDefaults.alphaMap
        refreshParamsSystem(this)
    }

    public get textureRepeat() {
        return this.materialParams[4]
    }
    public set textureRepeat(val: number | Point | undefined) {
        this.materialParams[4] = val ?? standardDefaults.textureRepeat
        refreshParamsSystem(this)
    }

    public get textureFlipY() {
        return this.materialParams[5]
    }
    public set textureFlipY(val: boolean | undefined) {
        this.materialParams[5] = val ?? standardDefaults.textureFlipY
        refreshParamsSystem(this)
    }

    public get textureRotation() {
        return this.materialParams[6]
    }
    public set textureRotation(val: number | undefined) {
        this.materialParams[6] = val ?? standardDefaults.textureRotation
        refreshParamsSystem(this)
    }

    public get wireframe() {
        return this.materialParams[7]
    }
    public set wireframe(val: boolean | undefined) {
        this.materialParams[7] = val ?? standardDefaults.wireframe
        refreshParamsSystem(this)
    }

    public get envMap() {
        return this.materialParams[8]
    }
    public set envMap(val: string | undefined) {
        this.materialParams[8] = val ?? standardDefaults.envMap
        refreshParamsSystem(this)
    }

    public get envMapIntensity() {
        return this.materialParams[9]
    }
    public set envMapIntensity(val: number | undefined) {
        this.materialParams[9] = val ?? standardDefaults.envMapIntensity
        refreshParamsSystem(this)
    }

    public get aoMap() {
        return this.materialParams[10]
    }
    public set aoMap(val: string | undefined) {
        this.materialParams[10] = val ?? standardDefaults.aoMap
        refreshParamsSystem(this)
    }

    public get aoMapIntensity() {
        return this.materialParams[11]
    }
    public set aoMapIntensity(val: number | undefined) {
        this.materialParams[11] = val ?? standardDefaults.aoMapIntensity
        refreshParamsSystem(this)
    }

    public get bumpMap() {
        return this.materialParams[12]
    }
    public set bumpMap(val: string | undefined) {
        this.materialParams[12] = val ?? standardDefaults.bumpMap
        refreshParamsSystem(this)
    }

    public get bumpScale() {
        return this.materialParams[13]
    }
    public set bumpScale(val: number | undefined) {
        this.materialParams[13] = val ?? standardDefaults.bumpScale
        refreshParamsSystem(this)
    }

    public get displacementMap() {
        return this.materialParams[14]
    }
    public set displacementMap(val: string | undefined) {
        this.materialParams[14] = val ?? standardDefaults.displacementMap
        refreshParamsSystem(this)
    }

    public get displacementScale() {
        return this.materialParams[15]
    }
    public set displacementScale(val: number | undefined) {
        this.materialParams[15] = val ?? standardDefaults.displacementScale
        refreshParamsSystem(this)
    }

    public get displacementBias() {
        return this.materialParams[16]
    }
    public set displacementBias(val: number | undefined) {
        this.materialParams[16] = val ?? standardDefaults.displacementBias
        refreshParamsSystem(this)
    }

    public get emissive() {
        return this.materialParams[17]
    }
    public set emissive(val: boolean | undefined) {
        this.materialParams[17] = val ?? standardDefaults.emissive
        refreshParamsSystem(this)
    }

    public get emissiveIntensity() {
        return this.materialParams[18]
    }
    public set emissiveIntensity(val: number | undefined) {
        this.materialParams[18] = val ?? standardDefaults.emissiveIntensity
        refreshParamsSystem(this)
    }

    public get lightMap() {
        return this.materialParams[19]
    }
    public set lightMap(val: string | undefined) {
        this.materialParams[19] = val ?? standardDefaults.lightMap
        refreshParamsSystem(this)
    }

    public get lightMapIntensity() {
        return this.materialParams[20]
    }
    public set lightMapIntensity(val: number | undefined) {
        this.materialParams[20] = val ?? standardDefaults.lightMapIntensity
        refreshParamsSystem(this)
    }

    public get metalnessMap() {
        return this.materialParams[21]
    }
    public set metalnessMap(val: string | undefined) {
        this.materialParams[21] = val ?? standardDefaults.metalnessMap
        refreshParamsSystem(this)
    }

    public get metalness() {
        return this.materialParams[22]
    }
    public set metalness(val: number | undefined) {
        this.materialParams[22] = val ?? standardDefaults.metalness
        refreshParamsSystem(this)
    }

    public get roughnessMap() {
        return this.materialParams[23]
    }
    public set roughnessMap(val: string | undefined) {
        this.materialParams[23] = val ?? standardDefaults.roughnessMap
        refreshParamsSystem(this)
    }

    public get roughness() {
        return this.materialParams[24]
    }
    public set roughness(val: number | undefined) {
        this.materialParams[24] = val ?? standardDefaults.roughness
        refreshParamsSystem(this)
    }

    public get normalMap() {
        return this.materialParams[25]
    }
    public set normalMap(val: string | undefined) {
        this.materialParams[25] = val ?? standardDefaults.normalMap
        refreshParamsSystem(this)
    }

    public get normalScale() {
        return this.materialParams[26]
    }
    public set normalScale(val: number | undefined) {
        this.materialParams[26] = val ?? standardDefaults.normalScale
        refreshParamsSystem(this)
    }
}
