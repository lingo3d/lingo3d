export default (level: number) => {
    let result = ""
    for (let i = 0; i < level; ++i)
        result += "    "
    return result
}