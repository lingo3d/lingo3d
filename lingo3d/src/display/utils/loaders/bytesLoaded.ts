const bytesLoaded = [0]
export default bytesLoaded

export const handleProgress = (e: { loaded: number }) => bytesLoaded[0] += e.loaded