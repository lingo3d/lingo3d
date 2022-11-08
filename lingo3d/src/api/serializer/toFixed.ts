const toFixed = (key: string, v: number) => Number(v.toFixed(2))
export default toFixed

export const toFixedPoint = (value: { x: number; y: number; z?: number }) => {
    if (value.z !== undefined)
        return {
            x: toFixed("x", value.x),
            y: toFixed("y", value.y),
            z: toFixed("z", value.z)
        }
    return {
        x: toFixed("x", value.x),
        y: toFixed("y", value.y)
    }
}
