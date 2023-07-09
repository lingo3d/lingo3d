export default (...values: Array<number>) => {
    let sum = 0
    for (let i = 0, iMax = values.length; i < iMax; ++i) sum += values[i]
    return sum / values.length
}
