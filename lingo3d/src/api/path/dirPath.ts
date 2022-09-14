import { last } from "@lincode/utils"

export default (url: string) => {
    const parts = url.split("/")
    if (last(parts)?.includes(".")) {
        parts.pop()
        return parts.join("/")
    }
    return url
}
