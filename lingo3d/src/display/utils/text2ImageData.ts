const canvas = document.createElement("canvas")
canvas.width = 200
canvas.height = 256

const context = canvas.getContext("2d")!
context.font = "bold 200px Arial"
context.fillStyle = "white"

export default (text: string) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillText(text, 0, 200)
    return canvas.toDataURL("image/png")
}