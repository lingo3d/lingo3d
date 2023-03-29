import { Sprite, SpriteMaterial } from "three"
import ISpriteSheet, {
    spriteSheetDefaults,
    spriteSheetSchema
} from "../interface/ISpriteSheet"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import {
    addConfigSpriteSheetSystem,
    deleteConfigSpriteSheetSystem
} from "../systems/autoClear/configSpriteSheetSystem"

export default class SpriteSheet
    extends PhysicsObjectManager
    implements ISpriteSheet
{
    public static componentName = "spriteSheet"
    public static defaults = spriteSheetDefaults
    public static schema = spriteSheetSchema

    public material: SpriteMaterial

    public constructor() {
        const material = new SpriteMaterial({
            transparent: true,
            visible: false
        })
        super(new Sprite(material))
        this.material = material
    }

    protected override disposeNode() {
        super.disposeNode()
        deleteConfigSpriteSheetSystem(this)
    }

    public blob: Blob | undefined
    public toBlob() {
        return this.blob
    }

    private _textureStart?: string
    public get textureStart() {
        return this._textureStart
    }
    public set textureStart(value) {
        this._textureStart = value
        addConfigSpriteSheetSystem(this)
    }

    private _textureEnd?: string
    public get textureEnd() {
        return this._textureEnd
    }
    public set textureEnd(value) {
        this._textureEnd = value
        addConfigSpriteSheetSystem(this)
    }

    private _texture?: string
    public get texture() {
        return this._texture
    }
    public set texture(value) {
        this._texture = value
        addConfigSpriteSheetSystem(this)
    }

    private _columns?: number
    public get columns() {
        return this._columns
    }
    public set columns(value) {
        this._columns = value
        addConfigSpriteSheetSystem(this)
    }

    private _length?: number
    public get length() {
        return this._length
    }
    public set length(value) {
        this._length = value
        addConfigSpriteSheetSystem(this)
    }

    private _loop?: boolean
    public get loop() {
        return this._loop
    }
    public set loop(value) {
        this._loop = value
        addConfigSpriteSheetSystem(this)
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}
}
