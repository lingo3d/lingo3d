export default (
    to: Record<string, any>,
    from: Record<string, any>,
    keys: Array<string>
) => {
    for (const key of keys) key in to && (to[key] = from[key])
}
