export default (filename: string, blob: Blob) => {
    const elem = document.createElement("a")
    const objectURL = elem.href = URL.createObjectURL(blob)
    elem.download = filename        
    document.body.appendChild(elem)
    elem.click()        
    document.body.removeChild(elem)
    URL.revokeObjectURL(objectURL)
}