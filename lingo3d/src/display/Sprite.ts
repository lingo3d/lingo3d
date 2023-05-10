import { Sprite as ThreeSprite, SpriteMaterial } from "three"
import ISprite, { spriteDefaults, spriteSchema } from "../interface/ISprite"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import { ColorString } from "../interface/ITexturedStandard"
import loadTexture from "./utils/loaders/loadTexture"
import { Point } from "@lincode/math"
import { addConfigSpriteSystem } from "../systems/configSystems/configSpriteSystem"
import { castBackBlending, castBlending } from "./utils/castBlending"

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
        this.$material.map = val ? loadTexture(val) : null
        addConfigSpriteSystem(this)
    }

    private _alphaMap?: string
    public get alphaMap() {
        return this._alphaMap
    }
    public set alphaMap(val) {
        this._alphaMap = val
        this.$material.alphaMap = val ? loadTexture(val) : null
        addConfigSpriteSystem(this)
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

    private _textureRepeat: Point | number = new Point(1, 1)
    public get textureRepeat() {
        return this._textureRepeat
    }
    public set textureRepeat(val) {
        this._textureRepeat = val
        addConfigSpriteSystem(this)
    }

    private _textureFlipY = false
    public get textureFlipY() {
        return this._textureFlipY
    }
    public set textureFlipY(val) {
        this._textureFlipY = val
        addConfigSpriteSystem(this)
    }

    private _textureRotation = 0
    public get textureRotation() {
        return this._textureRotation
    }
    public set textureRotation(val) {
        this._textureRotation = val
        addConfigSpriteSystem(this)
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
