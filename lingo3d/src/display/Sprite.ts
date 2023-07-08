import { Sprite as ThreeSprite, SpriteMaterial } from "three"
import ISprite, { spriteDefaults, spriteSchema } from "../interface/ISprite"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import { ColorString } from "../interface/ITexturedStandard"
import { castBackBlending, castBlending } from "./utils/castBlending"
import { ssrExcludeSet } from "../collections/ssrExcludeSet"
import { configSpriteSystem } from "../systems/configSystems/configSpriteSystem"

export default class Sprite
    extends PhysicsObjectManager<ThreeSprite>
    implements ISprite
{
    public static componentName = "sprite"
    public static defaults = spriteDefaults
    public static schema = spriteSchema

    public $material: SpriteMaterial

    public constructor() {
        const material = new SpriteMaterial({ transparent: true })
        super(new ThreeSprite(material))
        this.$material = material
        ssrExcludeSet.add(this.$object)
    }

    protected override disposeNode() {
        super.disposeNode()
        ssrExcludeSet.delete(this.$object)
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}

    private _texture?: string
    public get texture() {
        return this._texture
    }
    public set texture(val) {
        this._texture = val
        configSpriteSystem.add(this)
    }

    private _alphaMap?: string
    public get alphaMap() {
        return this._alphaMap
    }
    public set alphaMap(val) {
        this._alphaMap = val
        configSpriteSystem.add(this)
    }

    public get color() {
        return ("#" + this.$material.color.getHexString()) as ColorString
    }
    public set color(val) {
        this.$material.color.set(val)
    }

    public get opacity() {
        return this.$material.opacity
    }
    public set opacity(val) {
        this.$material.opacity = val
    }

    private _textureRepeat = 1
    public get textureRepeat() {
        return this._textureRepeat
    }
    public set textureRepeat(val) {
        this._textureRepeat = val
        configSpriteSystem.add(this)
    }

    private _textureFlipY = false
    public get textureFlipY() {
        return this._textureFlipY
    }
    public set textureFlipY(val) {
        this._textureFlipY = val
        configSpriteSystem.add(this)
    }

    private _textureRotation = 0
    public get textureRotation() {
        return this._textureRotation
    }
    public set textureRotation(val) {
        this._textureRotation = val
        configSpriteSystem.add(this)
    }

    public get depthTest() {
        return this.$material.depthTest
    }
    public set depthTest(val) {
        this.$material.depthTest = val
    }

    public get blending() {
        return castBackBlending(this.$material.blending)
    }
    public set blending(val) {
        this.$material.blending = castBlending(val)
    }
}
