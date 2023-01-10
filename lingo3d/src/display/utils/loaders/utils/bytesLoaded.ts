const bytesLoaded = [0]

const loadedBytesMap = new Map<string, number>()

const progressChangedEventListeners = new Set<(bytes: number) => void>()

export const addLoadedBytesChangedEventListeners = (
    listener: (bytes: number) => void
) => {
    progressChangedEventListeners.add(listener)
}
export const removeLoadedBytesChangedEventListeners = (
    listener: (bytes: number) => void
) => {
    progressChangedEventListeners.delete(listener)
}

export default bytesLoaded

export const handleProgress =
    (url: string) => (e: { loaded: number; total: number }) => {
        loadedBytesMap.set(url, e.loaded)

        bytesLoaded[0] = [...loadedBytesMap.values()].reduce(
            (acc, cur) => acc + cur,
            0
        )
        progressChangedEventListeners.forEach((listener) => {
            try {
                listener(bytesLoaded[0])
            } finally {
            }
        })
    }
