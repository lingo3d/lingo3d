export const objectURLMapperPtr: [(url: string) => string] = [(url: string) => url]

export default (fn: (url: string) => string) => {
    objectURLMapperPtr[0] = fn
}