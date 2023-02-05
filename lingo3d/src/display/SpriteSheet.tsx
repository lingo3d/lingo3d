import { Reactive } from "@lincode/reactivity"
import createInstancePool from "./core/utils/createInstancePool"
import { Sprite, SpriteMaterial } from "three"
import loadTexture from "./utils/loaders/loadTexture"
import { Cancellable } from "@lincode/promiselikes"
import VisibleObjectManager from "./core/VisibleObjectManager"
import ISpriteSheet, {
    spriteSheetDefaults,
    spriteSheetSchema
} from "../interface/ISpriteSheet"
import beforeRenderSystemWithData from "../utils/beforeRenderSystemWithData"

const numbers = new Set("01234567890".split(""))

const scanSerial = (_textureStart: string) => {
    let isNumberOld = false
    let count = 0
    let startIndex = -1
    let endIndex = -1
    for (let i = _textureStart.length - 1; i >= 0; --i) {
        const isNumber = numbers.has(_textureStart[i])
        if (isNumberOld !== isNumber) {
            ++count
            if (count === 1) endIndex = i + 1
            else if (count === 2) {
                startIndex = i + 1
                break
            }
        }
        isNumberOld = isNumber
    }
    if (startIndex === -1 || endIndex === -1) return []

    const serial = _textureStart.substring(startIndex, endIndex)
    const start = _textureStart.substring(0, startIndex)
    const end = _textureStart.substring(endIndex)

    return [serial, start, end] as const
}

type Params = [textureStart: string, textureEnd: string]

const [increaseCount, decreaseCount] = createInstancePool<
    Promise<[string, number, number, Blob | undefined]>,
    Params
>(
    async (_, [textureStart, textureEnd]) => {
        const [serialStart, start, end] = scanSerial(textureStart)
        if (!serialStart) return ["", 0, 0, undefined]

        const [serialEnd] = scanSerial(textureEnd)
        if (!serialEnd) return ["", 0, 0, undefined]

        const serialStrings: Array<string> = []

        const iMax = Number(serialEnd)
        if (serialStart[0] === "0")
            for (let i = Number(serialStart); i <= iMax; ++i)
                serialStrings.push((i + "").padStart(serialEnd.length, "0"))
        else
            for (let i = Number(serialStart); i <= iMax; ++i)
                serialStrings.push(i + "")

        const imagePromises = serialStrings.map(
            (serial) =>
                new Promise<HTMLImageElement>((resolve) => {
                    const image = new Image()
                    image.onload = () => resolve(image)
                    image.src = start + serial + end
                })
        )
        const images = await Promise.all(imagePromises)
        const [{ naturalWidth, naturalHeight }] = images

        const columns = 5
        const rows = Math.ceil(imagePromises.length / columns)
        const canvas = document.createElement("canvas")
        canvas.width = naturalWidth * columns
        canvas.height = rows * naturalHeight
        const ctx = canvas.getContext("2d")!

        let x = 0
        let y = 0
        for (const image of images) {
            ctx.drawImage(image, x * naturalWidth, y * naturalHeight)
            if (++x === columns) {
                x = 0
                ++y
            }
        }
        return new Promise<[string, number, number, Blob | undefined]>(
            (resolve) =>
                canvas.toBlob((blob) =>
                    resolve([
                        URL.createObjectURL(blob!),
                        columns,
                        imagePromises.length,
                        blob!
                    ])
                )
        )
    },
    (promise) => promise.then(([url]) => URL.revokeObjectURL(url))
)

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

const [addPlaySystem, deletePlaySystem] = beforeRenderSystemWithData(
    (
        material: SpriteMaterial,
        data: {
            x: number
            y: number
            columns: number
            rows: number
            frame: number
            length: number
            loop: boolean | undefined
        }
    ) => {
        material.map!.offset.set(data.x / data.columns, data.y / data.rows)
        if (++data.x === data.columns) {
            data.x = 0
            --data.y
        }
        if (++data.frame < data.length) return
        data.frame = 0
        data.x = 0
        data.y = data.rows - 1
        !data.loop && deletePlaySystem(material)
    }
)

const playSpriteSheet = (
    material: SpriteMaterial,
    columns: number,
    length: number,
    loop: boolean | undefined,
    handle: Cancellable
) => {
    material.visible = true
    const rows = Math.ceil(length / columns)
    addPlaySystem(material, {
        x: 0,
        y: rows - 1,
        columns,
        rows,
        frame: 0,
        length,
        loop
    })
    handle.then(() => deletePlaySystem(material))
}

export default class SpriteSheet
    extends VisibleObjectManager
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
                const params: Params = [_textureStart, _textureEnd]
                const paramString = JSON.stringify(params)
                increaseCount(Promise, params, paramString).then(
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
                    decreaseCount(Promise, paramString)
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
        this.refreshState.set({})
    }

    private _textureEnd?: string
    public get textureEnd() {
        return this._textureEnd
    }
    public set textureEnd(value) {
        this._textureEnd = value
        this.refreshState.set({})
    }

    private _texture?: string
    public get texture() {
        return this._texture
    }
    public set texture(value) {
        this._texture = value
        this.refreshState.set({})
    }

    private _columns?: number
    public get columns() {
        return this._columns
    }
    public set columns(value) {
        this._columns = value
        this.refreshState.set({})
    }

    private _length?: number
    public get length() {
        return this._length
    }
    public set length(value) {
        this._length = value
        this.refreshState.set({})
    }

    private _loop?: boolean
    public get loop() {
        return this._loop
    }
    public set loop(value) {
        this._loop = value
        this.refreshState.set({})
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
