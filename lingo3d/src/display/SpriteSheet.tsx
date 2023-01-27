import Sprite from "./Sprite"
import { Reactive } from "@lincode/reactivity"

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

export default class SpriteSheet extends Sprite {
    public constructor() {
        super()

        this.createEffect(() => {
            const { _srcStart, _srcEnd } = this
            if (!_srcStart || !_srcEnd) return

            const [serialStart, start, end] = scanSerial(_srcStart)
            if (!serialStart) return

            const [serialEnd] = scanSerial(_srcEnd)
            if (!serialEnd) return

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
            Promise.all(imagePromises).then((images) => {
                const img = images[0]
                const area =
                    img.naturalWidth * img.naturalHeight * imagePromises.length
                const width = img.naturalWidth * 5
                const height = area / width

                const canvas = document.createElement("canvas")
                Object.assign(canvas.style, {
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    zIndex: "9999"
                })
                document.body.appendChild(canvas)

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext("2d")!

                let x = 0
                let y = 0
                for (const image of images) {
                    if (++x === 5) {
                        x = 0
                        ++y
                    }
                    ctx.drawImage(
                        image,
                        x * img.naturalWidth,
                        y * img.naturalHeight
                    )
                }
            })
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
