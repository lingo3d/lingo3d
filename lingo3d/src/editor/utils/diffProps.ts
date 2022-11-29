export default (
    prev: Record<string, any>,
    next: Record<string, any>,
    omit: Record<string, true> = { style: true }
) => {
    for (const [k, v] of Object.entries(prev))
        if (!omit[k] && v !== next[k]) return false
    return true
}
