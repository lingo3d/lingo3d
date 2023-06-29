import createSharedPool from "./utils/createSharedPool"

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

type SpriteSheetParams = [textureStart: string, textureEnd: string]

export const spriteSheetPool = createSharedPool<
    Promise<[string, number, number, Blob | undefined]>,
    SpriteSheetParams
>(
    async ([textureStart, textureEnd]) => {
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
