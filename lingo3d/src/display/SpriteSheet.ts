import { Sprite, SpriteMaterial } from "three"
import ISpriteSheet, {
    spriteSheetDefaults,
    spriteSheetSchema
} from "../interface/ISpriteSheet"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import { castBackBlending, castBlending } from "./utils/castBlending"
import { excludeSSRSet } from "../collections/excludeSSRSet"
import { configSpriteSheetSystem } from "../systems/configSystems/configSpriteSheetSystem"

export default class SpriteSheet
    extends PhysicsObjectManager<Sprite>
    implements ISpriteSheet
{
    public static componentName = "spriteSheet"
    public static defaults = spriteSheetDefaults
    public static schema = spriteSheetSchema

    public constructor() {
        super(
            new Sprite(
                new SpriteMaterial({
                    transparent: true,
                    visible: false
                })
            )
        )
        excludeSSRSet.add(this.outerObject3d)
    }

    protected override disposeNode() {
        super.disposeNode()
        excludeSSRSet.delete(this.outerObject3d)
    }

    public $blob: Blob | undefined
    public toBlob() {
        return this.$blob
    }

    private _textureStart?: string
    public get textureStart() {
        return this._textureStart
    }
    public set textureStart(value) {
        this._textureStart = value
        configSpriteSheetSystem.add(this)
    }

    private _textureEnd?: string
    public get textureEnd() {
        return this._textureEnd
    }
    public set textureEnd(value) {
        this._textureEnd = value
        configSpriteSheetSystem.add(this)
    }

    private _texture?: string
    public get texture() {
        return this._texture
    }
    public set texture(value) {
        this._texture = value
        configSpriteSheetSystem.add(this)
    }

    private _columns?: number
    public get columns() {
        return this._columns
    }
    public set columns(value) {
        this._columns = value
        configSpriteSheetSystem.add(this)
    }

    private _length?: number
    public get length() {
        return this._length
    }
    public set length(value) {
        this._length = value
        configSpriteSheetSystem.add(this)
    }

    private _loop?: boolean
    public get loop() {
        return this._loop
    }
    public set loop(value) {
        this._loop = value
        configSpriteSheetSystem.add(this)
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}

    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}

    public get blending() {
        return castBackBlending(this.object3d.material.blending)
    }
    public set blending(val) {
        this.object3d.material.blending = castBlending(val)
    }
}
