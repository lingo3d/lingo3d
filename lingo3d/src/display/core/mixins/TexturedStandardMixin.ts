import { Point } from "@lincode/math"
import { BufferGeometry, Mesh, MeshStandardMaterial } from "three"
import ITexturedStandard, {
    ColorString,
    texturedStandardDefaults,
    texturedStandardSchema
} from "../../../interface/ITexturedStandard"
import getDefaultValue from "../../../interface/utils/getDefaultValue"
import { color, standardMaterial } from "../../utils/reusables"
import MeshAppendable from "../../../api/core/MeshAppendable"
import {
    allocateDefaultMaterial,
    MaterialParams
} from "../../../pools/materialPool"
import { addRefreshTexturedStandardSystem } from "../../../systems/configSystems/refreshTexturedStandardSystem"

export const standardDefaults = Object.fromEntries(
    Object.entries(texturedStandardSchema).map(([key]) => [
        key,
        structuredClone(getDefaultValue(texturedStandardDefaults, key, true))
    ])
)
export const standardDefaultParams = Object.values(
    standardDefaults
) as MaterialParams

allocateDefaultMaterial(standardDefaultParams, standardMaterial)

export type StandardMesh = Mesh<BufferGeometry, MeshStandardMaterial>

export default abstract class TexturedStandardMixin
    extends MeshAppendable<StandardMesh>
    implements ITexturedStandard
{
    public get material() {
        return this.object3d.material
    }
    public set material(val: MeshStandardMaterial) {
        this.object3d.material = val
    }

    private _materialParams?: MaterialParams
    public get materialParams() {
        return (this._materialParams ??= Object.values(
            standardDefaultParams
        ) as MaterialParams)
    }

    public materialParamString?: string

    public get color() {
        return this.materialParams[0]
    }
    public set color(val: ColorString | undefined) {
        this.materialParams[0] = val
            ? "#" + color.set(val).getHexString()
            : standardDefaults.color
        addRefreshTexturedStandardSystem(this)
    }

    public get opacity() {
        return this.materialParams[1]
    }
    public set opacity(val: number | undefined) {
        this.materialParams[1] = val ?? standardDefaults.opacity
        addRefreshTexturedStandardSystem(this)
    }

    public get texture() {
        return this.materialParams[2]
    }
    public set texture(val: string | undefined) {
        this.materialParams[2] = val ?? standardDefaults.texture
        addRefreshTexturedStandardSystem(this)
    }

    public get alphaMap() {
        return this.materialParams[3]
    }
    public set alphaMap(val: string | undefined) {
        this.materialParams[3] = val ?? standardDefaults.alphaMap
        addRefreshTexturedStandardSystem(this)
    }

    public get textureRepeat() {
        return this.materialParams[4]
    }
    public set textureRepeat(val: number | Point | undefined) {
        this.materialParams[4] = val ?? standardDefaults.textureRepeat
        addRefreshTexturedStandardSystem(this)
    }

    public get textureFlipY() {
        return this.materialParams[5]
    }
    public set textureFlipY(val: boolean | undefined) {
        this.materialParams[5] = val ?? standardDefaults.textureFlipY
        addRefreshTexturedStandardSystem(this)
    }

    public get textureRotation() {
        return this.materialParams[6]
    }
    public set textureRotation(val: number | undefined) {
        this.materialParams[6] = val ?? standardDefaults.textureRotation
        addRefreshTexturedStandardSystem(this)
    }

    public get wireframe() {
        return this.materialParams[7]
    }
    public set wireframe(val: boolean | undefined) {
        this.materialParams[7] = val ?? standardDefaults.wireframe
        addRefreshTexturedStandardSystem(this)
    }

    public get envMap() {
        return this.materialParams[8]
    }
    public set envMap(val: string | undefined) {
        this.materialParams[8] = val ?? standardDefaults.envMap
        addRefreshTexturedStandardSystem(this)
    }

    public get envMapIntensity() {
        return this.materialParams[9]
    }
    public set envMapIntensity(val: number | undefined) {
        this.materialParams[9] = val ?? standardDefaults.envMapIntensity
        addRefreshTexturedStandardSystem(this)
    }

    public get aoMap() {
        return this.materialParams[10]
    }
    public set aoMap(val: string | undefined) {
        this.materialParams[10] = val ?? standardDefaults.aoMap
        addRefreshTexturedStandardSystem(this)
    }

    public get aoMapIntensity() {
        return this.materialParams[11]
    }
    public set aoMapIntensity(val: number | undefined) {
        this.materialParams[11] = val ?? standardDefaults.aoMapIntensity
        addRefreshTexturedStandardSystem(this)
    }

    public get bumpMap() {
        return this.materialParams[12]
    }
    public set bumpMap(val: string | undefined) {
        this.materialParams[12] = val ?? standardDefaults.bumpMap
        addRefreshTexturedStandardSystem(this)
    }

    public get bumpScale() {
        return this.materialParams[13]
    }
    public set bumpScale(val: number | undefined) {
        this.materialParams[13] = val ?? standardDefaults.bumpScale
        addRefreshTexturedStandardSystem(this)
    }

    public get displacementMap() {
        return this.materialParams[14]
    }
    public set displacementMap(val: string | undefined) {
        this.materialParams[14] = val ?? standardDefaults.displacementMap
        addRefreshTexturedStandardSystem(this)
    }

    public get displacementScale() {
        return this.materialParams[15]
    }
    public set displacementScale(val: number | undefined) {
        this.materialParams[15] = val ?? standardDefaults.displacementScale
        addRefreshTexturedStandardSystem(this)
    }

    public get displacementBias() {
        return this.materialParams[16]
    }
    public set displacementBias(val: number | undefined) {
        this.materialParams[16] = val ?? standardDefaults.displacementBias
        addRefreshTexturedStandardSystem(this)
    }

    public get emissive() {
        return this.materialParams[17]
    }
    public set emissive(val: boolean | undefined) {
        this.materialParams[17] = val ?? standardDefaults.emissive
        addRefreshTexturedStandardSystem(this)
    }

    public get emissiveIntensity() {
        return this.materialParams[18]
    }
    public set emissiveIntensity(val: number | undefined) {
        this.materialParams[18] = val ?? standardDefaults.emissiveIntensity
        addRefreshTexturedStandardSystem(this)
    }

    public get lightMap() {
        return this.materialParams[19]
    }
    public set lightMap(val: string | undefined) {
        this.materialParams[19] = val ?? standardDefaults.lightMap
        addRefreshTexturedStandardSystem(this)
    }

    public get lightMapIntensity() {
        return this.materialParams[20]
    }
    public set lightMapIntensity(val: number | undefined) {
        this.materialParams[20] = val ?? standardDefaults.lightMapIntensity
        addRefreshTexturedStandardSystem(this)
    }

    public get metalnessMap() {
        return this.materialParams[21]
    }
    public set metalnessMap(val: string | undefined) {
        this.materialParams[21] = val ?? standardDefaults.metalnessMap
        addRefreshTexturedStandardSystem(this)
    }

    public get metalness() {
        return this.materialParams[22]
    }
    public set metalness(val: number | undefined) {
        this.materialParams[22] = val ?? standardDefaults.metalness
        addRefreshTexturedStandardSystem(this)
    }

    public get roughnessMap() {
        return this.materialParams[23]
    }
    public set roughnessMap(val: string | undefined) {
        this.materialParams[23] = val ?? standardDefaults.roughnessMap
        addRefreshTexturedStandardSystem(this)
    }

    public get roughness() {
        return this.materialParams[24]
    }
    public set roughness(val: number | undefined) {
        this.materialParams[24] = val ?? standardDefaults.roughness
        addRefreshTexturedStandardSystem(this)
    }

    public get normalMap() {
        return this.materialParams[25]
    }
    public set normalMap(val: string | undefined) {
        this.materialParams[25] = val ?? standardDefaults.normalMap
        addRefreshTexturedStandardSystem(this)
    }

    public get normalScale() {
        return this.materialParams[26]
    }
    public set normalScale(val: number | undefined) {
        this.materialParams[26] = val ?? standardDefaults.normalScale
        addRefreshTexturedStandardSystem(this)
    }

    public get depthTest() {
        return this.materialParams[27]
    }
    public set depthTest(val: boolean | undefined) {
        this.materialParams[27] = val ?? standardDefaults.depthTest
        addRefreshTexturedStandardSystem(this)
    }
}
