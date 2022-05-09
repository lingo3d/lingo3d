export default (filename: string, data: string) => {
    const blob = new Blob([data], {type: "text/plain"})
    const elem = document.createElement("a")
    const objectURL = elem.href = URL.createObjectURL(blob)
    elem.download = filename        
    document.body.appendChild(elem)
    elem.click()        
    document.body.removeChild(elem)
    URL.revokeObjectURL(objectURL)
}