export default (
    x: number,
    y: number,
    originX: number,
    originY: number
): 1 | 2 | 3 | 4 => {
    if (x >= originX && y <= originY) return 1
    if (x <= originX && y <= originY) return 2
    if (x <= originX && y >= originY) return 3
    return 4
}
