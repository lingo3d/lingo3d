import downloadBlob from "./downloadBlob"

export default (filename: string, data: string) => {
    const blob = new Blob([data], { type: "text/plain" })
    downloadBlob(filename, blob)
}
