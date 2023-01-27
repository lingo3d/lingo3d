import Sprite from "./Sprite"
import { decrease, Reactive } from "@lincode/reactivity"
import createInstancePool from "./core/utils/createInstancePool"

const numbers = new Set("01234567890".split(""))

const scanSerial = (_srcStart: string) => {
    let isNumberOld = false
    let count = 0
    let startIndex = -1
    let endIndex = -1
    for (let i = _srcStart.length - 1; i >= 0; --i) {
        const isNumber = numbers.has(_srcStart[i])
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

    const serial = _srcStart.substring(startIndex, endIndex)
    const start = _srcStart.substring(0, startIndex)
    const end = _srcStart.substring(endIndex)

    return [serial, start, end] as const
}

type Params = [srcStart: string, srcEnd: string]

const [increaseCount, decreaseCount] = createInstancePool<
    Promise<string>,
    Params
>(
    async (_, [srcStart, srcEnd]) => {
        const [serialStart, start, end] = scanSerial(srcStart)
        if (!serialStart) return ""

        const [serialEnd] = scanSerial(srcEnd)
        if (!serialEnd) return ""

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

        const canvas = document.createElement("canvas")
        canvas.width = naturalWidth * 5
        canvas.height = Math.ceil(imagePromises.length / 5) * naturalHeight
        const ctx = canvas.getContext("2d")!

        let x = 0
        let y = 0
        for (const image of images) {
            ctx.drawImage(image, x * naturalWidth, y * naturalHeight)
            if (++x === 5) {
                x = 0
                ++y
            }
        }
        return new Promise<string>((resolve) =>
            canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)))
        )
    },
    (promise) => promise.then((url) => URL.revokeObjectURL(url))
)
export default class SpriteSheet extends Sprite {
    public constructor() {
        super()

        this.createEffect(() => {
            const { _srcStart, _srcEnd } = this
            if (!_srcStart || !_srcEnd) return

            const params: Params = [_srcStart, _srcEnd]
            const paramString = JSON.stringify(params)
            increaseCount(Promise, params, paramString).then((url) => {
                this.texture = url
            })
            return () => {
                decreaseCount(Promise, paramString)
            }
        }, [this.refreshState.get])
    }

    private refreshState = new Reactive({})

    private _srcStart?: string
    public get srcStart() {
        return this._srcStart
    }
    public set srcStart(value: string | undefined) {
        this._srcStart = value
        this.refreshState.set({})
    }

    private _srcEnd?: string
    public get srcEnd() {
        return this._srcEnd
    }
    public set srcEnd(value: string | undefined) {
        this._srcEnd = value
        this.refreshState.set({})
    }
}
