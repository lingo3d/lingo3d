import { Point } from "@lincode/math"
import { Sprite } from "three"
import ITexturedBasic, {
    texturedBasicDefaults,
    texturedBasicSchema
} from "../../../interface/ITexturedBasic"
import getDefaultValue from "../../../interface/utils/getDefaultValue"
import { color } from "../../utils/reusables"
import MeshAppendable from "../../../api/core/MeshAppendable"
import { SpriteMaterialParams } from "../../../pools/spriteMaterialPool"
import { addRefreshTexturedSpriteSystem } from "../../../systems/configSystems/refreshTexturedSpriteSystem"

const defaults = Object.fromEntries(
    Object.entries(texturedBasicSchema).map(([key]) => [
        key,
        structuredClone(getDefaultValue(texturedBasicDefaults, key, true))
    ])
)
const defaultParams = Object.values(defaults) as SpriteMaterialParams

export default abstract class TexturedSpriteMixin
    extends MeshAppendable<Sprite>
    implements ITexturedBasic
{
    public get material() {
        return this.object3d.material
    }
    public set material(val) {
        this.object3d.material = val
    }

    private _materialParams?: SpriteMaterialParams
    public get materialParams() {
        return (this._materialParams ??= Object.values(
            defaultParams
        ) as SpriteMaterialParams)
    }

    public materialParamString?: string

    public get color() {
        return this.materialParams[0]
    }
    public set color(val: string | undefined) {
        this.materialParams[0] = val
            ? "#" + color.set(val).getHexString()
            : defaults.color
        addRefreshTexturedSpriteSystem(this)
    }

    public get opacity() {
        return this.materialParams[1]
    }
    public set opacity(val: number | undefined) {
        this.materialParams[1] = val ?? defaults.opacity
        addRefreshTexturedSpriteSystem(this)
    }

    public get texture() {
        return this.materialParams[2]
    }
    public set texture(val: string | undefined) {
        this.materialParams[2] = val ?? defaults.texture
        addRefreshTexturedSpriteSystem(this)
    }

    public get alphaMap() {
        return this.materialParams[3]
    }
    public set alphaMap(val: string | undefined) {
        this.materialParams[3] = val ?? defaults.alphaMap
        addRefreshTexturedSpriteSystem(this)
    }

    public get textureRepeat() {
        return this.materialParams[4]
    }
    public set textureRepeat(val: number | Point | undefined) {
        this.materialParams[4] = val ?? defaults.textureRepeat
        addRefreshTexturedSpriteSystem(this)
    }

    public get textureFlipY() {
        return this.materialParams[5]
    }
    public set textureFlipY(val: boolean | undefined) {
        this.materialParams[5] = val ?? defaults.textureFlipY
        addRefreshTexturedSpriteSystem(this)
    }

    public get textureRotation() {
        return this.materialParams[6]
    }
    public set textureRotation(val: number | undefined) {
        this.materialParams[6] = val ?? defaults.textureRotation
        addRefreshTexturedSpriteSystem(this)
    }
}
