export default (val: number) => {
    if (val === Infinity) return Number.MAX_SAFE_INTEGER
    if (val === -Infinity) return Number.MIN_SAFE_INTEGER
    return val
}
