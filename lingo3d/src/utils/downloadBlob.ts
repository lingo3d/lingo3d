export default (filename: string, blob: Blob | undefined | null) => {
    if (!blob) return
    const elem = document.createElement("a")
    const objectURL = (elem.href = URL.createObjectURL(blob))
    elem.download = filename
    document.body.appendChild(elem)
    elem.click()
    elem.remove()
    URL.revokeObjectURL(objectURL)
}
