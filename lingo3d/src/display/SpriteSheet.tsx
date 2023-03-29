import { Reactive } from "@lincode/reactivity"
import { Sprite, SpriteMaterial } from "three"
import loadTexture from "./utils/loaders/loadTexture"
import { Cancellable } from "@lincode/promiselikes"
import ISpriteSheet, {
    spriteSheetDefaults,
    spriteSheetSchema
} from "../interface/ISpriteSheet"
import PhysicsObjectManager from "./core/PhysicsObjectManager"
import {
    addSpriteSheetSystem,
    deleteSpriteSheetSystem
} from "../systems/spriteSheetSystem"
import {
    decreaseSpriteSheet,
    increaseSpriteSheet,
    SpriteSheetParams
} from "../pools/spriteSheetPool"
import { addRefreshStateSystem } from "../systems/autoClear/refreshStateSystem"

const loadSpriteSheet = (
    material: SpriteMaterial,
    url: string,
    columns: number,
    length: number
) => {
    const map = (material.map = loadTexture(url, () => {
        const rows = Math.ceil(length / columns)
        map.repeat.set(1 / columns, 1 / rows)
    }))
    return map
}

const playSpriteSheet = (
    material: SpriteMaterial,
    columns: number,
    length: number,
    loop: boolean | undefined,
    handle: Cancellable
) => {
    material.visible = true
    const rows = Math.ceil(length / columns)
    addSpriteSheetSystem(material, {
        x: 0,
        y: rows - 1,
        columns,
        rows,
        frame: 0,
        length,
        loop
    })
    handle.then(() => deleteSpriteSheetSystem(material))
}

export default class SpriteSheet
    extends PhysicsObjectManager
    implements ISpriteSheet
{
    public static componentName = "spriteSheet"
    public static defaults = spriteSheetDefaults
    public static schema = spriteSheetSchema

    public constructor() {
        const material = new SpriteMaterial({
            transparent: true,
            visible: false
        })
        super(new Sprite(material))

        this.createEffect(() => {
            const {
                _textureStart,
                _textureEnd,
                _texture,
                _columns,
                _length,
                _loop
            } = this
            if (_textureStart && _textureEnd) {
                const handle = new Cancellable()
                const params: SpriteSheetParams = [_textureStart, _textureEnd]
                const paramString = JSON.stringify(params)
                increaseSpriteSheet(params, paramString).then(
                    ([url, columns, length, blob]) => {
                        this.blob = blob
                        loadSpriteSheet(material, url, columns, length)
                        playSpriteSheet(
                            material,
                            columns,
                            length,
                            _loop,
                            handle
                        )
                    }
                )
                return () => {
                    decreaseSpriteSheet(paramString)
                    handle.cancel()
                }
            }
            if (!_texture || !_columns || !_length) return

            const handle = new Cancellable()
            loadSpriteSheet(material, _texture, _columns, _length)
            const timeout = setTimeout(() => {
                playSpriteSheet(material, _columns, _length, _loop, handle)
            }, 300)
            return () => {
                clearTimeout(timeout)
                handle.cancel()
            }
        }, [this.refreshState.get])
    }

    private blob: Blob | undefined
    public toBlob() {
        return this.blob
    }

    private refreshState = new Reactive({})

    private _textureStart?: string
    public get textureStart() {
        return this._textureStart
    }
    public set textureStart(value) {
        this._textureStart = value
        addRefreshStateSystem(this.refreshState)
    }

    private _textureEnd?: string
    public get textureEnd() {
        return this._textureEnd
    }
    public set textureEnd(value) {
        this._textureEnd = value
        addRefreshStateSystem(this.refreshState)
    }

    private _texture?: string
    public get texture() {
        return this._texture
    }
    public set texture(value) {
        this._texture = value
        addRefreshStateSystem(this.refreshState)
    }

    private _columns?: number
    public get columns() {
        return this._columns
    }
    public set columns(value) {
        this._columns = value
        addRefreshStateSystem(this.refreshState)
    }

    private _length?: number
    public get length() {
        return this._length
    }
    public set length(value) {
        this._length = value
        addRefreshStateSystem(this.refreshState)
    }

    private _loop?: boolean
    public get loop() {
        return this._loop
    }
    public set loop(value) {
        this._loop = value
        addRefreshStateSystem(this.refreshState)
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
