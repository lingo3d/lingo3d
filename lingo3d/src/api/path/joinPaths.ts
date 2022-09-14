import normalizePath from "./normalizePath"

export default (...args: Array<string>) => {
    if (args.length === 0) return "."
    var joined
    for (var i = 0; i < args.length; ++i) {
        var arg = args[i]
        if (arg.length > 0) {
            if (joined === undefined) joined = arg
            else joined += "/" + arg
        }
    }
    if (joined === undefined) return "."
    return normalizePath(joined)
}
