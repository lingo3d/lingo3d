import dirPath from "./dirPath"
import isRelativePath from "./isRelativePath"

const relativePath = (from: string, to: string) => {
    if (from === to) return ""

    // Trim any leading backslashes
    var fromStart = 1
    for (; fromStart < from.length; ++fromStart) {
        if (from.charCodeAt(fromStart) !== 47 /*/*/) break
    }
    var fromEnd = from.length
    var fromLen = fromEnd - fromStart

    // Trim any leading backslashes
    var toStart = 1
    for (; toStart < to.length; ++toStart) {
        if (to.charCodeAt(toStart) !== 47 /*/*/) break
    }
    var toEnd = to.length
    var toLen = toEnd - toStart

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen
    var lastCommonSep = -1
    var i = 0
    for (; i <= length; ++i) {
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47 /*/*/) {
                    // We get here if `from` is the exact base path for `to`.
                    // For example: from='/foo/bar'; to='/foo/bar/baz'
                    return to.slice(toStart + i + 1)
                } else if (i === 0) {
                    // We get here if `from` is the root
                    // For example: from='/'; to='/foo'
                    return to.slice(toStart + i)
                }
            } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
                    // We get here if `to` is the exact base path for `from`.
                    // For example: from='/foo/bar/baz'; to='/foo/bar'
                    lastCommonSep = i
                } else if (i === 0) {
                    // We get here if `to` is the root.
                    // For example: from='/foo'; to='/'
                    lastCommonSep = 0
                }
            }
            break
        }
        var fromCode = from.charCodeAt(fromStart + i)
        var toCode = to.charCodeAt(toStart + i)
        if (fromCode !== toCode) break
        else if (fromCode === 47 /*/*/) lastCommonSep = i
    }

    var out = ""
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
            if (out.length === 0) out += ".."
            else out += "/.."
        }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep)
    else {
        toStart += lastCommonSep
        if (to.charCodeAt(toStart) === 47 /*/*/) ++toStart
        return to.slice(toStart)
    }
}

export default (from: string, to: string) => {
    const result = relativePath(dirPath(from), to)
    if (isRelativePath(result)) return result
    return "./" + result
}
